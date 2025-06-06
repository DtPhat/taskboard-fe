import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { boardService } from "@/services/boardService";
import { MemberList } from "./MemberList";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NotificationBell } from "./NotificationBell";

export function BoardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { boardId } = useParams<{ boardId: string }>();

  const { data: board, isLoading: isBoardLoading } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoardById(boardId!),
    enabled: !!boardId,
  });

  if (!boardId) {
    return (
      <Sidebar {...props}>
        <SidebarContent className="mt-16 bg-white"></SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (isBoardLoading) {
    return (
      <Sidebar {...props}>
        <SidebarContent className="mt-20 px-2 bg-white">
          Loading...
        </SidebarContent>
      </Sidebar>
    );
  }
  

  return (
    <Sidebar {...props}>
      <SidebarContent className="mt-16 bg-white">
        <div className="flex flex-col gap-2 p-2">
          <div className="rounded">
            <div className="flex items-center justify-between p-2">
              <h2 className="text-lg font-semibold">{board?.name}</h2>
            </div>
          </div>
          <Separator />
          <div className="border rounded p-2">
            <h3 className="text-sm font-medium mb-2">Members</h3>
            <div className="space-y-2">
              {board?.members?.map((member) => (
                <Card key={member.id} className="p-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={"https://avatars.githubusercontent.com/u/124599?v=4"} alt={member.name} />
                      <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
