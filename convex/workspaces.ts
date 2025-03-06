import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('workspaces').collect();
    }
})

export const create = mutation({
    args: {
        name: v.string()
    },
    handler: async(ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if(!userId){
            throw new Error("UnAuthorized");
        }

        // TODO Create a proper Method Later
        const joinCode = "123456"
        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId
        })
        return workspaceId;
        
    }
})