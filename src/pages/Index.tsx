
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardCard } from "@/components/BoardCard";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { useNavigate } from "react-router-dom";

// Mock data for boards
const mockBoards = [
  {
    id: "1",
    name: "Project Alpha",
    description: "Main project development board",
    cardCount: 12,
    memberCount: 5,
    color: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    id: "2", 
    name: "Marketing Campaign",
    description: "Q4 marketing initiatives and campaigns",
    cardCount: 8,
    memberCount: 3,
    color: "bg-gradient-to-br from-green-500 to-teal-600"
  },
  {
    id: "3",
    name: "Product Roadmap",
    description: "Feature planning and development timeline",
    cardCount: 15,
    memberCount: 7,
    color: "bg-gradient-to-br from-orange-500 to-red-600"
  }
];

const Index = () => {
  const [boards, setBoards] = useState(mockBoards);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateBoard = (boardData: { name: string; description: string }) => {
    const newBoard = {
      id: Date.now().toString(),
      ...boardData,
      cardCount: 0,
      memberCount: 1,
      color: "bg-gradient-to-br from-indigo-500 to-purple-600"
    };
    setBoards([...boards, newBoard]);
    setIsCreateDialogOpen(false);
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Boards</h1>
          <p className="text-white/80 text-lg">Organize your projects and collaborate with your team</p>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {boards.map((board) => (
            <BoardCard 
              key={board.id} 
              board={board} 
              onClick={() => handleBoardClick(board.id)}
            />
          ))}
          
          {/* Create New Board Card */}
          <div 
            className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-200 min-h-[200px]"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-12 h-12 text-white/70 mb-3" />
            <span className="text-white/70 font-medium">Create new board</span>
          </div>
        </div>

        <CreateBoardDialog 
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateBoard={handleCreateBoard}
        />
      </div>
    </div>
  );
};

export default Index;
