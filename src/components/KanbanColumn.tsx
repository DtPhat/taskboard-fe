
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KanbanCard } from "@/components/KanbanCard";
import { Droppable } from "@hello-pangea/dnd";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface CardType {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  members: string[];
  priority: "low" | "medium" | "high";
  dueDate: string | null;
}

interface Column {
  id: string;
  title: string;
  cards: CardType[];
}

interface KanbanColumnProps {
  column: Column;
  onAddCard: () => void;
}

export const KanbanColumn = ({ column, onAddCard }: KanbanColumnProps) => {
  return (
    <div className="min-w-[300px] bg-white/10 backdrop-blur-md rounded-xl p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-lg">{column.title}</h3>
        <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/20 h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Cards Container */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[400px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-white/10 rounded-lg p-2' : ''
            }`}
          >
            {column.cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      <Button 
        variant="ghost" 
        onClick={onAddCard}
        className="w-full mt-3 text-white/70 hover:bg-white/20 border-2 border-dashed border-white/30 hover:border-white/50"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add a task
      </Button>
    </div>
  );
};
