import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/services/boardService";
import { ToastAction } from "@/components/ui/toast";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const storedUser = localStorage.getItem("user");

  useEffect(() => {
    if (!storedUser) return;
    const userData = JSON.parse(storedUser);
    if (!userData?.id) return;
    const userId = userData.id;
    const socketInstance = io(import.meta.env.VITE_API_URL, {
      auth: {
        userId,
      },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    // Handle board invitation
    socketInstance.on("board-invitation", (data) => {
      toast({
        // duration: Infinity,
        title: "Board Invitation",
        description: `You've been invited to join a board`,
        action: (
          <div className="flex gap-2">
            <ToastAction
              onClick={() => {
                // Handle accept invitation
                boardService.acceptInvite({
                  status: "accepted",
                  inviteId: data.invite_id,
                  boardId: data.boardId,
                });
                queryClient.invalidateQueries({ queryKey: ["boards"] });
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
              altText={"Accept"}
            >
              Accept
            </ToastAction>
            <ToastAction
              onClick={() => {
                // Handle decline invitation
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
              altText={"Decline"}
            >
              Decline
            </ToastAction>
          </div>
        ),
      });
    });

    // Handle board join
    socketInstance.on("board-join", (data) => {
      toast({
        title: "New Member Joined",
        description: `${data.userData.name} has joined the board`,
      });
      // Refresh board data
      queryClient.invalidateQueries({ queryKey: ["board", data.boardId] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [storedUser]);

  const joinBoard = (boardId: string) => {
    if (socket) {
      socket.emit("join-board", boardId);
    }
  };

  const leaveBoard = (boardId: string) => {
    if (socket) {
      socket.emit("leave-board", boardId);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, joinBoard, leaveBoard }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
