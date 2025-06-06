import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, UpdateTaskDto } from '../services/taskService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      <div className="font-semibold">{task.title}</div>
      <div className="text-gray-600 text-sm">{task.description}</div>
      <div className="flex gap-2 mt-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Input id="edit-desc" value={editTask.description} onChange={e => setEditTask({ ...editTask, description: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Button size="sm" variant="destructive" onClick={() => deleteTaskMutation.mutate()}>Delete</Button>
      </div>
    </div>
  );
} 