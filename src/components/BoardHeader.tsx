import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { boardService } from "@/services/boardService";

interface BoardHeaderProps {
  boardId: string;
  boardName: string;
  onBoardNameChange: (newName: string) => void;
}

export function BoardHeader({
  boardId,
  boardName,
  onBoardNameChange,
}: BoardHeaderProps) {
  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  if (!boardId) {
    return;
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <div className="flex gap-2">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-6"
        />
        <Input
          value={boardName}
          onChange={(e) => onBoardNameChange(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
      </div>
      <div className="flex items-center space-x-4">
        <InviteMemberDialog boardId={boardId} />
      </div>
    </header>
  );
}
