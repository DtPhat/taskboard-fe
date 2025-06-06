import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { boardService, Board, CreateBoardDto, UpdateBoardDto } from "../services/boardService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BoardList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);
  const [selectedBoard, setSelectedBoard] = React.useState<Board | null>(null);
  const [newBoard, setNewBoard] = React.useState<CreateBoardDto>({
    name: "",
    description: "",
  });
  const [updateBoard, setUpdateBoard] = React.useState<UpdateBoardDto>({
    name: "",
    description: "",
  });

  const {
    data: boards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: boardService.getAllBoards,
  });

  const createBoardMutation = useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setIsCreateDialogOpen(false);
      setNewBoard({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Board created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create board",
        variant: "destructive",
      });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBoardDto }) =>
      boardService.updateBoard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setIsUpdateDialogOpen(false);
      setSelectedBoard(null);
      toast({
        title: "Success",
        description: "Board updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update board",
        variant: "destructive",
      });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => boardService.deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast({
        title: "Success",
        description: "Board deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete board",
        variant: "destructive",
      });
    },
  });

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    createBoardMutation.mutate(newBoard);
  };

  const handleUpdateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBoard) {
      updateBoardMutation.mutate({ id: selectedBoard.id, data: updateBoard });
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      deleteBoardMutation.mutate(boardId);
    }
  };

  const handleUpdateClick = (board: Board) => {
    setSelectedBoard(board);
    setUpdateBoard({
      name: board.name,
      description: board.description,
    });
    setIsUpdateDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading boards...</div>;
  }

  if (error) {
    return <div className="p-4">Error loading boards</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Boards</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Board</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Board Name</Label>
                <Input
                  id="name"
                  value={newBoard.name}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newBoard.description}
                  onChange={(e) =>
                    setNewBoard({ ...newBoard, description: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create Board
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards?.map((board) => (
          <Card
            key={board.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1" onClick={() => navigate(`/boards/${board.id}`)}>
                <CardTitle>{board.name}</CardTitle>
                <CardDescription>{board.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleUpdateClick(board)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteBoard(board.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent onClick={() => navigate(`/boards/${board.id}`)}>
              <p className="text-sm text-gray-500">Click to view board details</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Board</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBoard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-name">Board Name</Label>
              <Input
                id="update-name"
                value={updateBoard.name}
                onChange={(e) =>
                  setUpdateBoard({ ...updateBoard, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-description">Description</Label>
              <Input
                id="update-description"
                value={updateBoard.description}
                onChange={(e) =>
                  setUpdateBoard({ ...updateBoard, description: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update Board
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
