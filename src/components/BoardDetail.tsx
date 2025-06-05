import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { boardService } from '../services/boardService';
import { cardService, Card, CreateCardDto } from '../services/cardService';
import { Button } from '@/components/ui/button';
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = React.useState(false);
  const [newCard, setNewCard] = React.useState<CreateCardDto>({
    name: '',
    description: '',
  });

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => boardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  const { data: cards, isLoading: isCardsLoading } = useQuery({
    queryKey: ['cards', boardId],
    queryFn: () => cardService.getAllCards(boardId!),
    enabled: !!boardId,
  });

  const createCardMutation = useMutation({
    mutationFn: (data: CreateCardDto) => cardService.createCard(boardId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
      setIsCreateCardDialogOpen(false);
      setNewCard({ name: '', description: '' });
      toast({
        title: 'Success',
        description: 'Card created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create card',
        variant: 'destructive',
      });
    },
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    createCardMutation.mutate(newCard);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cards || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Here you would typically update the order in the backend
    // For now, we'll just update the local state
    queryClient.setQueryData(['cards', boardId], items);
  };

  if (isBoardLoading || isCardsLoading) {
    return <div>Loading board...</div>;
  }

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{board.name}</h1>
          <p className="text-gray-600">{board.description}</p>
        </div>
        <Dialog open={isCreateCardDialogOpen} onOpenChange={setIsCreateCardDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Card</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input
                  id="card-name"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-description">Description</Label>
                <Input
                  id="card-description"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Card
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {cards?.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <UICard
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/boards/${boardId}/cards/${card.id}`)}
                      >
                        <CardHeader>
                          <CardTitle>{card.name}</CardTitle>
                          <CardDescription>{card.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{card.tasks_count || 0} tasks</span>
                            <span>{card.list_member?.length || 0} members</span>
                          </div>
                        </CardContent>
                      </UICard>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 