import { useState } from "react";
import { TrashIcon } from "lucide-react";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-worksace";
import { useDeleteWorkspace } from "@/features/workspaces/api/use-delete-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}
export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success("Workspace Updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteWorkspace({
      id: workspaceId
    }, {
      onSuccess: () => {
        toast.success("Workspace deleted");
        setEditOpen(false);
      },
      onError: () => {
        toast.error("Failed to delete workspace");
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Workspace name</p>
                  <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                    Edit
                  </p>
                </div>
                <p className="text-sm">{value}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this workspace</DialogTitle>
              </DialogHeader>
              <form action="" className="space-y-4" onSubmit={handleEdit}>
                <Input
                  value={value}
                  required
                  disabled={isUpdatingWorkspace}
                  autoFocus
                  onChange={(e) => setValue(e.target.value)}
                  minLength={3}
                  maxLength={80}
                  placeholder="Workspace name e..g 'Work', 'Home', 'Personal'"
                />
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() => setEditOpen(false)}
                    disabled={isUpdatingWorkspace}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button disabled={isUpdatingWorkspace}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button
            disabled={isDeletingWorkspace || isUpdatingWorkspace}
            onClick={handleDelete}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-500"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete Workspace</p>
          </button>
        </div>
      </DialogContent>
      <DialogFooter></DialogFooter>
    </Dialog>
  );
};
