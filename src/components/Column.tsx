import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, CreateTaskDto } from '../services/taskService';
import { cardService, UpdateCardDto } from '../services/cardService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
  boardId: string;
  cardId: string;
  title: string;
  tasks: Task[];
  provided: any;
  snapshot: any;
}

export function Column({ boardId, cardId, title, tasks, provided, snapshot }: ColumnProps) {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState<CreateTaskDto>({
    title: '',
    description: '',
    status: 'TODO',
  });
  const [updateCard, setUpdateCard] = React.useState<UpdateCardDto>({
    name: title,
    description: '',
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.createTask(boardId, cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
      setIsCreateDialogOpen(false);
      setNewTask({ title: '', description: '', status: 'TODO' });
    },
    onError: (error) => {
       console.error("Failed to create task:", error);
    }
  });

  const updateCardMutation = useMutation({
    mutationFn: (data: UpdateCardDto) => cardService.updateCard(boardId, cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
      setIsUpdateDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update card:", error);
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: () => cardService.deleteCard(boardId, cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', boardId] });
    },
    onError: (error) => {
      console.error("Failed to delete card:", error);
    }
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    updateCardMutation.mutate(updateCard);
  };

  const handleDeleteCard = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCardMutation.mutate();
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`rounded-xl p-4 w-80 min-h-96 flex flex-col border ${snapshot.isDraggingOver ? 'ring-2 ring-pink-400' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg">{title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteCard} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 flex flex-col gap-3 mb-4">
        {tasks.map((task, idx) => (
          <Draggable key={task.id} draggableId={task.id} index={idx}>
            {(provided, snapshot) => (
              <TaskCard
                task={task}
                boardId={boardId}
                cardId={cardId}
                dragHandleProps={provided.dragHandleProps}
                draggableProps={provided.draggableProps}
                innerRef={provided.innerRef}
                isDragging={snapshot.isDragging}
              />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-dashed">+ Add a card</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Title</Label>
              <Input id="task-title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Description</Label>
              <Input id="task-desc" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full">Create</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name">Name</Label>
              <Input 
                id="card-name" 
                value={updateCard.name} 
                onChange={e => setUpdateCard({ ...updateCard, name: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-desc">Description</Label>
              <Input 
                id="card-desc" 
                value={updateCard.description} 
                onChange={e => setUpdateCard({ ...updateCard, description: e.target.value })} 
                required 
              />
            </div>
            <Button type="submit" className="w-full">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 