import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '@/services/boardService';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { User } from 'lucide-react';

interface InviteMemberDialogProps {
  boardId: string;
}

export function InviteMemberDialog({ boardId }: InviteMemberDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) =>
      boardService.inviteMember(boardId, {
        // invite_id: crypto.randomUUID(),
        board_owner_id: user?.id || '',
        member_id: user?.id, // This will be set by the backend
        email_member: email,
        status: 'pending',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      setOpen(false);
      setEmail('');
      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      inviteMemberMutation.mutate(email.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <User />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={inviteMemberMutation.isPending}>
            {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 