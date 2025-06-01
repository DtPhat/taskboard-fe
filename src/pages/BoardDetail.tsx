import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "@/components/KanbanColumn";
import { CreateCardDialog } from "@/components/CreateCardDialog";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

// Mock data for cards
const mockColumns = [
  {
    id: "organize-me",
    title: "Organize Me",
    cards: [
      {
        id: "1",
        title: "Order printer paper",
        description: "Need to order new printer paper for the office",
        tasks: [],
        members: [],
        priority: "high" as const,
        dueDate: null
      },
      {
        id: "2", 
        title: "Reconcile books",
        description: "Monthly financial reconciliation",
        tasks: [
          { id: "t1", title: "Review transactions", completed: false },
          { id: "t2", title: "Update spreadsheet", completed: true }
        ],
        members: [],
        priority: "medium" as const,
        dueDate: null
      },
      {
        id: "3",
        title: "Review contract internally", 
        description: "Legal review of new vendor contract",
        tasks: [],
        members: [],
        priority: "medium" as const,
        dueDate: "Sep 24"
      },
      {
        id: "4",
        title: "Call Kevin",
        description: "Follow up on project status",
        tasks: [],
        members: [],
        priority: "low" as const,
        dueDate: null
      }
    ]
  },
  {
    id: "to-do",
    title: "To Do", 
    cards: []
  },
  {
    id: "on-hold",
    title: "On Hold",
    cards: [
      {
        id: "5",
        title: "Move ABC project forward",
        description: "Continue development on ABC project",
        tasks: [
          { id: "t3", title: "Design review", completed: false },
          { id: "t4", title: "Code implementation", completed: false }
        ],
        members: [],
        priority: "high" as const, 
        dueDate: null
      }
    ]
  }
];

const BoardDetail = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState(mockColumns);
  const [isCreateCardDialogOpen, setIsCreateCardDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");

  const handleCreateCard = (cardData: { title: string; description: string }, columnId: string) => {
    const newCard = {
      id: Date.now().toString(),
      ...cardData,
      tasks: [],
      members: [],
      priority: "medium" as const,
      dueDate: null
    };

    setColumns(prevColumns => 
      prevColumns.map(column => 
        column.id === columnId 
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );
    setIsCreateCardDialogOpen(false);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;

    const draggedCard = sourceColumn.cards.find(card => card.id === draggableId);
    if (!draggedCard) return;

    setColumns(prevColumns => {
      return prevColumns.map(column => {
        if (column.id === source.droppableId) {
          // Remove card from source
          return {
            ...column,
            cards: column.cards.filter(card => card.id !== draggableId)
          };
        } else if (column.id === destination.droppableId) {
          // Add card to destination
          const newCards = [...column.cards];
          newCards.splice(destination.index, 0, draggedCard);
          return {
            ...column,
            cards: newCards
          };
        }
        return column;
      });
    });
  };

  const openCreateCardDialog = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateCardDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Boards
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Project Board</h1>
              <p className="text-white/80">Manage your project tasks and workflow</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Members
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn 
                key={column.id}
                column={column}
                onAddCard={() => openCreateCardDialog(column.id)}
              />
            ))}
            
            {/* Add New Column */}
            <div className="min-w-[300px] bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-dashed border-white/40">
              <Button 
                variant="ghost" 
                className="w-full h-full min-h-[100px] text-white/70 hover:bg-white/20 border-none"
              >
                <Plus className="w-6 h-6 mr-2" />
                Add another card
              </Button>
            </div>
          </div>
        </DragDropContext>

        <CreateCardDialog 
          open={isCreateCardDialogOpen}
          onOpenChange={setIsCreateCardDialogOpen}
          onCreateCard={(cardData) => handleCreateCard(cardData, selectedColumnId)}
        />
      </div>
    </div>
  );
};

export default BoardDetail;
