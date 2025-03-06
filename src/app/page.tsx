"use client";

import { useEffect, useMemo } from "react";

import { UserButton } from "@/features/auth/components/user-button";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    else if (!!workspaceId) {
      console.log("Redirect to workspace");
    } else if (!open) {
      console.log("Open Workspace Creation Modal");
      setOpen(!open);
    }
  }, [workspaceId, isLoading, open, setOpen]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
