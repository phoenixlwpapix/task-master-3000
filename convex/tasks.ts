import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
    },
});

// Add a new task
export const add = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.insert("tasks", {
            text: args.text,
            isCompleted: false,
        });
    },
});

// Toggle task completion status
export const toggle = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.id);
        if (task) {
            await ctx.db.patch(args.id, {
                isCompleted: !task.isCompleted,
            });
        }
    },
});

// Delete a task
export const remove = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
