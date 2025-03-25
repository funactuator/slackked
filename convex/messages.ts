import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("Unauthorized");
    }

    let _conversation_id = args.conversationId;

    // this only happens when we reply in 1:1 conversation in a thread
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversation_id = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessagedId: args.parentMessageId,
      conversationId: _conversation_id,
      body: args.body,
      image: args.image,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
