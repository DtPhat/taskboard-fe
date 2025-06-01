
import { Users, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Board {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  memberCount: number;
  color: string;
}

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

export const BoardCard = ({ board, onClick }: BoardCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 hover:scale-105 transition-all duration-200 hover:shadow-xl"
      onClick={onClick}
    >
      <div className={`${board.color} p-6 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-2 line-clamp-1">{board.name}</h3>
          <p className="text-white/90 text-sm mb-4 line-clamp-2">{board.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{board.cardCount} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{board.memberCount} members</span>
            </div>
          </div>
        </div>
        
        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
        </div>
      </div>
    </Card>
  );
};
