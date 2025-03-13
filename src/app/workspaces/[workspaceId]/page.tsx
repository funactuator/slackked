"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/members/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const WorkspaceIdPage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      !workspace ||
      memberLoading ||
      !member
    )
      return;
    if (channelId) {
      router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    workspace,
    workspaceLoading,
    channelsLoading,
    open,
    setOpen,
    router,
    workspaceId,
    isAdmin,
    member,
    memberLoading,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace Not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No Channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
