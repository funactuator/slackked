"use client"
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal();

  const handleClose = () => {
    setOpen(false);
    // TODO : Clear Form
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <Input
            type="text"
            required
            value=""
            disabled={false}
            minLength={3}
            autoFocus
            placeholder="Workspace name e..g 'Work', 'Home', 'Personal'"
          />
        </form>
        <div className="flex justify-end">
          <Button onClick={(() => {})}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
