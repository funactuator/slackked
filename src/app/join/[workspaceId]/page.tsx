"use client";
import VerificationInput from "react-verification-input";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const handleComplete = (value) => {
    mutate({workspaceId, joinCode: value}, {
      onSuccess: (id) => {
        router.replace(`/workspaces/${id}`)
        toast.success("Workspace Joined!")
      },
      onError: () => {
        toast.error("Failed to join workspace")
      }
    })
  }

  if(isLoading){
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground"/>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-y-6 items-center justify-center bg-white px-8 rounded-lg shadow-md">
      <Image
        src="/logo.svg"
        alt="logo"
        width={60}
        height={60}
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          autoFocus
          length={6}
          classNames={{
            container: cn('!flex !gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
            character: "!uppercase !h-auto !rounded-xs !border !border-gray-300 !flex !items-center !justify-center !text-lg !font-medium !text-gray-500",
            characterInactive: "!bg-muted",
            characterSelected: "!bg-white !text-black",
            characterFilled: "!bg-white !text-black",
          }}
          onComplete={handleComplete}
        />
      </div>
      <div className="flex mt-2 gap-x-4">
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to home </Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
