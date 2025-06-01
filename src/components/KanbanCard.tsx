
import { Calendar, CheckSquare, MessageSquare, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Draggable } from "@hello-pangea/dnd";

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

interface KanbanCardProps {
  card: CardType;
  index: number;
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500", 
  high: "bg-red-500"
};

export const KanbanCard = ({ card, index }: KanbanCardProps) => {
  const completedTasks = card.tasks.filter(task => task.completed).length;
  const totalTasks = card.tasks.length;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          }`}
        >
          {/* Priority indicator */}
          <div className={`w-full h-1 ${priorityColors[card.priority]} rounded-full mb-3`} />
          
          {/* Card content */}
          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{card.title}</h4>
          
          {card.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
          )}

          {/* Card footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Task progress */}
              {totalTasks > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckSquare className="w-3 h-3" />
                  <span>{completedTasks}/{totalTasks}</span>
                </div>
              )}
              
              {/* Due date */}
              {card.dueDate && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {card.dueDate}
                </Badge>
              )}
            </div>

            {/* Members */}
            {card.members.length > 0 && (
              <div className="flex -space-x-2">
                {card.members.slice(0, 3).map((member, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center"
                  >
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                ))}
                {card.members.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-xs text-white">
                    +{card.members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );
};
