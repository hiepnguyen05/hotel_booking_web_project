import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface DeleteRoomConfirmationProps {
  roomName: string;
  onConfirm: () => void;
}

export function DeleteRoomConfirmation({ roomName, onConfirm }: DeleteRoomConfirmationProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setShowConfirmation(false);
  };

  return (
    <div>
      {showConfirmation ? (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <span className="text-red-800 text-sm">
            Xóa phòng <span className="font-semibold">{roomName}</span>?
          </span>
          <div className="flex gap-1">
            <Button 
              className="h-8 px-2 text-xs"
              variant="destructive" 
              size="sm"
              onClick={handleConfirm}
            >
              Xóa
            </Button>
            <Button 
              className="h-8 px-2 text-xs"
              variant="outline" 
              size="sm"
              onClick={() => setShowConfirmation(false)}
            >
              Hủy
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          className="h-8 w-8 p-0"
          variant="destructive" 
          size="sm"
          onClick={() => setShowConfirmation(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}