import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  joinCode: string;
  name: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();

    const handleCopy = () => { 
        const inviteLink = `${location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Invite link copied to clipboard")
        })
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
          <DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">{joinCode}</p>
            <Button onClick={handleCopy} variant="ghost" size="sm">
                Copy Link 
                <CopyIcon className="size-4 ml-2"/>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
