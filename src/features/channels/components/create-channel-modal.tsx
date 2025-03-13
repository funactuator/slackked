import { useState } from "react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChannelModal } from "@/features/members/store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const CreateChannelModal = () => {
    const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [open, setOpen] = useCreateChannelModal();
  const { mutate, isPending } = useCreateChannel();

  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s+/g, "-").toLocaleLowerCase();
    setName(val);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          router.push(`/workspaces/${workspaceId}/channels/${id}`)
          handleClose();
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
