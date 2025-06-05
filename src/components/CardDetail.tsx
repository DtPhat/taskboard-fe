import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardService } from '../services/cardService';
import { taskService, Task, CreateTaskDto } from '../services/taskService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CardDetail() {
  const { boardId, cardId } = useParams<{ boardId: string; cardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState<CreateTaskDto>({
    title: '',
    description: '',
    status: 'TODO',
  });

  const { data: card, isLoading: isCardLoading } = useQuery({
    queryKey: ['card', boardId, cardId],
    queryFn: () => cardService.getCardById(boardId!, cardId!),
    enabled: !!boardId && !!cardId,
  });

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks', boardId, cardId],
    queryFn: () => taskService.getAllTasks(boardId!, cardId!),
    enabled: !!boardId && !!cardId,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskDto) => taskService.createTask(boardId!, cardId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, cardId] });
      setIsCreateTaskDialogOpen(false);
      setNewTask({ title: '', description: '', status: 'TODO' });
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  };

  if (isCardLoading || isTasksLoading) {
    return <div>Loading card...</div>;
  }

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{card.name}</h1>
          <p className="text-gray-600">{card.description}</p>
        </div>
        <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Input
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-status">Status</Label>
                <select
                  id="task-status"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{task.title}</CardTitle>
                <Badge
                  variant={
                    task.status === 'TODO'
                      ? 'secondary'
                      : task.status === 'IN_PROGRESS'
                      ? 'default'
                      : 'outline'
                  }
                >
                  {task.status}
                </Badge>
              </div>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.ownerId}`} />
                  <AvatarFallback>{task.ownerId?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500">Owner</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 