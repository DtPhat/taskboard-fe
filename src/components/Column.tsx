import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task, CreateTaskDto } from '../services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { TaskCard } from './TaskCard';
import { Droppable, Draggable } from 'react-beautiful-dnd';

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
  const [newTask, setNewTask] = React.useState<CreateTaskDto>({
    title: '',
    description: '',
    status: 'TODO',
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

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className={`rounded-xl p-4 w-80 min-h-96 flex flex-col border ${snapshot.isDraggingOver ? 'ring-2 ring-pink-400' : ''}`}
    >
      <div className="font-bold text-lg mb-4">{title}</div>
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
    </div>
  );
} 