import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all tasks for the current user
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return []; // Return empty if not logged in

        return await ctx.db
            .query("tasks")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();
    },
});

// Add a new task
export const add = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.insert("tasks", {
            text: args.text,
            isCompleted: false,
            userId,
        });
    },
});

// Toggle task completion status
export const toggle = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const task = await ctx.db.get(args.id);
        if (!task || task.userId !== userId) {
            throw new Error("Unauthorized access to task");
        }

        await ctx.db.patch(args.id, {
            isCompleted: !task.isCompleted,
        });
    },
});

// Delete a task
export const remove = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const task = await ctx.db.get(args.id);
        if (!task || task.userId !== userId) {
            throw new Error("Unauthorized access to task");
        }

        await ctx.db.delete(args.id);
    },
});
