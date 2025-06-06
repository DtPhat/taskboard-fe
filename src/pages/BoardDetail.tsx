import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardService } from "../services/boardService";
import { cardService, CreateCardDto, Card } from "../services/cardService";
import { taskService, Task, UpdateTaskDto } from "../services/taskService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Column } from "../components/Column";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

export function BoardDetail() {
  const { boardId } = useParams<{ boardId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] =
    React.useState(false);
  const [newCard, setNewCard] = React.useState<CreateCardDto>({
    name: "",
    description: "",
  });

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  const { data: cards, isLoading: isCardsLoading } = useQuery({
    queryKey: ["cards", boardId],
    queryFn: () => cardService.getAllCards(boardId!),
    enabled: !!boardId,
  });

  // Fetch all tasks for each card using React Query
  const { data: allTasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: async () => {
      if (!cards?.length) return [];
      console.log("Fetching tasks for cards:", cards);
      const tasksPromises = cards.map((card) =>
        taskService.getAllTasks(boardId!, card.id).catch((error) => {
          console.error(`Error fetching tasks for card ${card.id}:`, error);
          return [];
        })
      );
      const tasksResults = await Promise.all(tasksPromises);
      const combinedTasks = tasksResults.flat();
      console.log("Combined tasks:", combinedTasks);
      return combinedTasks;
    },
    enabled: !!boardId && !!cards?.length,
  });

  const createCardMutation = useMutation({
    mutationFn: (data: CreateCardDto) => cardService.createCard(boardId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
      setIsCreateCardDialogOpen(false);
      setNewCard({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Card created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create card",
        variant: "destructive",
      });
    },
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    createCardMutation.mutate(newCard);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a droppable area or back in the same spot
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const sourceCardId = source.droppableId;
    const destCardId = destination.droppableId;
    const draggedTask = allTasks.find((task) => task.id === draggableId);
    console.log(sourceCardId, destCardId, draggedTask);
    if (!draggedTask) return;

    try {
      // Update the task's cardId in the backend
      await taskService.updateTask(boardId!, sourceCardId, draggableId, {
        id: draggableId,
        // ownerId: draggedTask.ownerId || "",
        newCardId: destCardId,
        title: draggedTask.title,
        description: draggedTask.description,
        status: draggedTask.status,
      } as UpdateTaskDto);

      // Optimistically update the UI
      const updatedTasks = allTasks.map((task) =>
        task.id === draggableId ? { ...task, cardId: destCardId } : task
      );

      // Update the cache
      queryClient.setQueryData(["tasks", boardId], updatedTasks);

      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    } catch (error) {
      console.error("Failed to move task:", error);
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive",
      });
    }
  };

  // Group tasks by cardId for rendering
  const tasksByCardId = React.useMemo(() => {
    console.log("Grouping tasks:", allTasks);
    const grouped: Record<string, Task[]> = {};
    allTasks.forEach((task) => {
      if (!grouped[task.cardId]) {
        grouped[task.cardId] = [];
      }
      grouped[task.cardId].push(task);
    });
    console.log("Grouped tasks:", grouped);
    return grouped;
  }, [allTasks]);

  if (isBoardLoading || isCardsLoading || isTasksLoading) {
    return <div className="p-2">Loading board...</div>;
  }

  if (!board || !cards) {
    return <div>Board or cards not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-x-auto p-8">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-wrap gap-8">
              {cards?.map((card) => (
                <Droppable droppableId={card.id} key={card.id} type="task">
                  {(provided, snapshot) => (
                    <Column
                      key={card.id}
                      boardId={boardId!}
                      cardId={card.id}
                      title={card.name}
                      tasks={tasksByCardId[card.id] || []}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Droppable>
              ))}
              <div className="min-w-80">
                <Dialog
                  open={isCreateCardDialogOpen}
                  onOpenChange={setIsCreateCardDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-16 border-dashed bg-gray-200"
                    >
                      + Add another list
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New List</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCard} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-name">List Name</Label>
                        <Input
                          id="card-name"
                          value={newCard.name}
                          onChange={(e) =>
                            setNewCard({ ...newCard, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-description">Description</Label>
                        <Input
                          id="card-description"
                          value={newCard.description}
                          onChange={(e) =>
                            setNewCard({
                              ...newCard,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Create List
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
