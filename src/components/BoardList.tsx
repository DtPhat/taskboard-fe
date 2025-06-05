import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { boardService, Board, CreateBoardDto } from '../services/boardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export function BoardList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [newBoard, setNewBoard] = React.useState<CreateBoardDto>({
    name: '',
    description: '',
  });

  const { data: boards, isLoading, error } = useQuery({
    queryKey: ['boards'],
    queryFn: boardService.getAllBoards,
  });

  const createBoardMutation = useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      setIsCreateDialogOpen(false);
      setNewBoard({ name: '', description: '' });
      toast({
        title: 'Success',
        description: 'Board created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create board',
        variant: 'destructive',
      });
    },
  });

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    createBoardMutation.mutate(newBoard);
  };

  if (isLoading) {
    return <div>Loading boards...</div>;
  }

  if (error) {
    return <div>Error loading boards</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Boards</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Board</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Board Name</Label>
                <Input
                  id="name"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newBoard.description}
                  onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Board
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards?.map((board) => (
          <Card
            key={board.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/boards/${board.id}`)}
          >
            <CardHeader>
              <CardTitle>{board.name}</CardTitle>
              <CardDescription>{board.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Click to view board details</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 