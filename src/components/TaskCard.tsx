import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService, Task, UpdateTaskDto } from "../services/taskService";
import { boardService, Member } from "../services/boardService";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

interface TaskCardProps {
  task: Task;
  boardId: string;
  cardId: string;
  dragHandleProps?: any;
  draggableProps?: any;
  innerRef?: (element: HTMLElement | null) => void;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  boardId,
  cardId,
  dragHandleProps,
  draggableProps,
  innerRef,
  isDragging,
}: TaskCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedMemberId, setSelectedMemberId] = React.useState<string | null>(null);
  const [isMemberSelectOpen, setIsMemberSelectOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: UpdateTaskDto) =>
      taskService.updateTask(boardId, cardId, task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsEditDialogOpen(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskService.deleteTask(boardId, cardId, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { data: boardMembers } = useQuery({
    queryKey: ["boardMembers", boardId],
    queryFn: () => boardService.getBoardMembers(boardId),
  });

  const assignMemberMutation = useMutation({
    mutationFn: (memberId: string) => taskService.assignMember(boardId, cardId, task.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: 'Success',
        description: 'Member assigned successfully',
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => taskService.removeMemberAssignment(boardId, cardId, task.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
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
      className={`bg-gray-50 rounded-lg p-4 shadow flex flex-col gap-2 mb-2 ${isDragging ? "ring-2 ring-pink-400" : ""
        }`}
    >
      <div onClick={() => setIsViewDialogOpen(true)} className="cursor-pointer space-y-2">
        <div className="flex justify-between items-start">
          <div className="font-semibold">{task.title}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsEditDialogOpen(true) }}>
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => { e.stopPropagation(); deleteTaskMutation.mutate() }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <div className="text-gray-600 text-sm">{task.description}</div> */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <Badge>{task.status}</Badge>
          </div>
          <div className="flex -space-x-3">
            {task.assignedMembers.map((member) => (
              <Avatar key={member.id} className="">
                <AvatarImage src={member.avatar} className="rounded-full min-h-6 min-w-6 size-6" />
                <AvatarFallback className="border rounded-full size-6 min-h-6 min-w-6">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
         </DialogHeader>
          <Separator />

          <div className="grid gap-8 py-2">
            <div className="flex gap-8 items-center">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  updateTaskMutation.mutate({ ...task, status: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">TODO</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                  <SelectItem value="DONE">DONE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <Label>Assignees</Label>
              <div className="flex gap-1">
                {task.assignedMembers.map((member) => (
                  <Avatar 
                    key={member.id} 
                    className="cursor-pointer transition-colors relative hover:ring-red-500 hover:ring-2 rounded-full"
                    onClick={() => removeMemberMutation.mutate(member.id)}
                  >
                    <AvatarImage src={member.avatar} className="rounded-full min-h-8 min-w-8 size-8" />
                    <AvatarFallback className="border rounded-full size-8 min-h-8 min-w-8">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    <Minus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 text-red-500 opacity-0 hover:opacity-100 transition-opacity" />
                  </Avatar>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="rounded-full size-8 border-dashed border-2"
                      variant="outline"
                    >
                      <Plus />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {boardMembers?.map((member) => (
                      <DropdownMenuItem key={member.id}
                        onClick={() => {
                          assignMemberMutation.mutate(member.id);
                        }}
                      >
                        <Avatar>
                          <AvatarImage src={member.avatar} className="rounded-full min-h-8 min-w-8 size-8" />
                          <AvatarFallback className="border rounded-full size-8 min-h-8 min-w-8">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="font-semibold ml-2">
                          {member.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              {/* <Textarea rows={4} value={task.description} readOnly className="bg-gray-50" /> */}
              <div className="text-sm">{task.description}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMemberSelectOpen} onOpenChange={setIsMemberSelectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={selectedMemberId}
              onValueChange={(value) => setSelectedMemberId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member..." />
              </SelectTrigger>
              <SelectContent>
                {boardMembers?.map((member) => (
                  <SelectItem key={member.id} value={member.id} >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="border rounded-full size-8 min-h-8 min-w-8">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                if (selectedMemberId) {
                  assignMemberMutation.mutate(selectedMemberId);
                  setIsMemberSelectOpen(false);
                }
              }}
              disabled={!selectedMemberId}
            >
              Assign Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                rows={4}
                id="edit-description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editTask.status}
                onValueChange={(value) =>
                  setEditTask({ ...editTask, status: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">TODO</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                  <SelectItem value="DONE">DONE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
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
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                rows={4}
                id="edit-description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editTask.status}
                onValueChange={(value) =>
                  setEditTask({ ...editTask, status: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">TODO</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                  <SelectItem value="DONE">DONE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>

  );
}
