import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { boardService } from "@/services/boardService";

export function BoardHeader() {
  const { boardId } = useParams<{ boardId: string }>();

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  if (isBoardLoading) {
    return <div className="p-2">Loading board...</div>;
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
      <div className="flex gap-2 items-center">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-6"
        />
        <Input
          value={board?.name}
          className="text-xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
      </div>
      {boardId && (
        <div className="flex items-center space-x-4">
          <InviteMemberDialog boardId={boardId} />
        </div>
      )}
    </header>
  );
}
