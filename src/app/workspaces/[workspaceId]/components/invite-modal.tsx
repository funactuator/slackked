import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useCreateNewJoinCode } from "@/features/workspaces/api/use-create-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  joinCode: string;
  name: string;
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useCreateNewJoinCode();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "This will deactivate the current invite code and generate a new one")

    const handleNewCode = async() => {
        const ok = await confirm();

        if(!ok)return;

        mutate({workspaceId}, {
            onSuccess: () => {
                toast.success("New invite code generated")
            },
            onError: () => {
                toast.error("Failed to generate new invite code");
            }
        })
    }

    const handleCopy = () => { 
        const inviteLink = `${location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Invite link copied to clipboard")
        })
    }

  return (
    <>
    <ConfirmDialog/>
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
        <div className="flex items-center justify-between w-full">
            <Button variant="outline" disabled={isPending} onClick={handleNewCode}>New code <RefreshCcw className="size-4 ml-2"/></Button>
            <DialogClose asChild>
                <Button>Close</Button>
            </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
