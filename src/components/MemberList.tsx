import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { memberService, Member } from '@/services/memberService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MemberListProps {
  boardId: string;
}

export function MemberList({ boardId }: MemberListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState({ name: '', email: '' });

  const { data: members, isLoading } = useQuery({
    queryKey: ['board-members', boardId],
    queryFn: () => memberService.getBoardMembers(boardId),
    enabled: !!boardId,
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => memberService.addBoardMember(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members', boardId] });
      setIsAddDialogOpen(false);
      setNewMember({ name: '', email: '' });
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => memberService.removeBoardMember(boardId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members', boardId] });
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    },
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    addMemberMutation.mutate(newMember);
  };

  if (isLoading) {
    return <div className="p-2">Loading members...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Members</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {members?.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-100">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeMemberMutation.mutate(member.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 