import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, UpdateTaskDto } from '../services/taskService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface TaskCardProps {
  task: Task;
  boardId: string;
  cardId: string;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, boardId, cardId, dragHandleProps, draggableProps, innerRef, isDragging }: TaskCardProps) {
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskDto) => taskService.updateTask(boardId, cardId, task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditDialogOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskService.deleteTask(boardId, cardId, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskMutation.mutate({ ...editTask, id: task.id });
  };

  return (
    <div
      ref={innerRef}
      {...draggableProps}
      {...dragHandleProps}
      className={`bg-white rounded-lg p-4 shadow flex flex-col gap-2 mb-2 ${isDragging ? 'ring-2 ring-pink-400' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="font-semibold">{task.title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => deleteTaskMutation.mutate()}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-gray-600 text-sm">{task.description}</div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={editTask.title} 
                onChange={e => setEditTask({ ...editTask, title: e.target.value })} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Input 
                id="edit-desc" 
                value={editTask.description} 
                onChange={e => setEditTask({ ...editTask, description: e.target.value })} 
                required 
              />
            </div>
            <Button type="submit" className="w-full">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 