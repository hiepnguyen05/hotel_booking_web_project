import { useState } from "react";
import { DeleteRoomConfirmation } from "./DeleteRoomConfirmation";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface RoomDeleteDialogProps {
  roomName: string;
  onConfirm: () => void;
}

export function RoomDeleteDialog({ roomName, onConfirm }: RoomDeleteDialogProps) {
  return (
    <DeleteRoomConfirmation 
      roomName={roomName} 
      onConfirm={onConfirm} 
    />
  );
}
