import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get All workspaces which the logged in user is part of
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    //Final Goal:  Return those workspaces whose the logged in user is part of

    // Return all member references which the current user has
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    // find workspace ids for each member reference

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];
    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      workspaces.push(workspace);
    }

    return workspaces;
  },
});

/**
 * Create a new workspace with given name
 */
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("UnAuthorized");
    }

    // TODO Create a proper Method Later
    const joinCode = "123456";
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      joinCode,
      userId,
    });

    // make workspace  creator as admin
    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

/**
 * get Workspace details by a given workspace id
 */
export const getById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .unique();
    if (!member) return null;

    const workspace = await ctx.db.get(member.workspaceId);
    return workspace;
  },
});
