import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get All workspaces which the logged in user is part of
 */
export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    // This checks authenticated state
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // this checks if authenticated user (api caller) is a valid member of workspace.
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member) return [];

    // this returns all the channels of the given id
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    if (!channels) return [];
    return channels;
  },
});

export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    
    const userId = await getAuthUserId(ctx);
    if(!userId)return null;

    const channel = await ctx.db.get(args.id);
    if(!channel)return null;

    const member = ctx.db.query("members").withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId)).unique();
    if(!member)return null;

    return channel;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") throw new Error("Unauthorized");

    const parsedName = args.name.replace(/\s+/g, "-").toLocaleLowerCase();

    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });
    return channelId;
  },
});
