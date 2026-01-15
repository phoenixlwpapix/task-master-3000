"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
// 1. 引入 Auth 专用的 Provider
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        // 2. 使用 ConvexAuthProvider 包裹，它会自动处理 Magic Link 的握手逻辑
        <ConvexAuthProvider client={convex}>
            {children}
        </ConvexAuthProvider>
    );
}
