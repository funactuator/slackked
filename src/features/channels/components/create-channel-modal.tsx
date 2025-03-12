import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogDescription,
    DialogContent,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
 
  import { useCreateChannelModal } from "@/features/members/store/use-create-channel-modal";
import { useState } from "react";

  export const CreateChannelModal = () => {

    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("");

    const handleClose = () => {
        setName("");
        setOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\s+/g, '-').toLocaleLowerCase();
        setName(val);
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a Channel
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                    <Input
                        value={name}
                        disabled={false}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={false}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
  }