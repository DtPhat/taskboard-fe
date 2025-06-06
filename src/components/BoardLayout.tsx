import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BoardSidebar } from "./BoardSidebar";
import { BoardHeader } from "./BoardHeader";
import { Outlet } from "react-router-dom";

const BoardLayout = () => {
  return (
    <SidebarProvider>
      <BoardSidebar />
      <SidebarInset className="">
        <BoardHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default BoardLayout;
