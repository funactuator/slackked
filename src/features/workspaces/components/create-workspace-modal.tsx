"use client";
import { useState } from "react";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";

export const CreateWorkspaceModal = () => {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateWorkspace();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name,
      },
      {
        onSuccess(id) {
          router.push(`/workspaces/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            minLength={3}
            autoFocus
            placeholder="Workspace name e..g 'Work', 'Home', 'Personal'"
          />
        </form>
        <div className="flex justify-end">
          <Button disabled={isPending} onClick={() => {}}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
