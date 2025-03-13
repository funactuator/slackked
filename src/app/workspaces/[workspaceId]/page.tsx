"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/members/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";

const WorkspaceIdPage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal()

  const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});
  const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  useEffect(() => {
    if(workspaceLoading || channelsLoading || !workspace)return;
    if(channelId){
      router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
    }else if(!open){
      setOpen(true)
    }
  }, [channelId, workspace, workspaceLoading, channelsLoading, open, setOpen, router, workspaceId])

  if(workspaceLoading || channelsLoading){
    return <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <Loader className="size-6 animate-spin text-muted-foreground"/>
    </div>
  }

  if(!workspace){
    return <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 animate-spin to-muted-foreground"/>
      <span className="text-sm text-muted-foreground">Workspace Not found</span>
    </div>
  }

  return null;
};

export default WorkspaceIdPage;
