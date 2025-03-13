import { Id } from "../../../../../convex/_generated/dataModel"
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const userItemVariants = cva(
  "flex justify-start items-center gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UserItemProps {
    id: Id<"members">,
    label?: string,
    image?: string,
    variant?: VariantProps<typeof userItemVariants>["variant"]
}

export const UserItem = ({id, label="Member", image, variant}: UserItemProps) => {
    const workspaceId = useWorkspaceId();
    const avatarFallback = label.charAt(0).toUpperCase();
    return (
        <Button
            variant="transparent"
            className={cn(userItemVariants({variant: variant}))}
            size="sm"
            asChild
        >
            <Link href={`/workspaces/${workspaceId}members/${id}`}>
            <Avatar className="size-5 rounded-sm mr-1 -ml-2">
                <AvatarImage className="rounded-sm" src={image}/>
                <AvatarFallback className="bg-sky-500 text-white text-xs rounded-sm">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}