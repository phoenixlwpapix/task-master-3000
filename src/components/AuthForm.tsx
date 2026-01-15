"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Mail, Lock, AlertTriangle } from "lucide-react";

export function AuthForm() {
    const { signIn } = useAuthActions();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signIn("password", { email, password, flow: isLogin ? "signIn" : "signUp" });
        } catch (err) {
            console.error(err);
            setError("Authentication failed. Please check your credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-20">
            <div className="bg-neo-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-3xl font-black uppercase mb-6 text-center tracking-tighter">
                    {isLogin ? "Access Terminal" : "Initialize Agent"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <Mail className="absolute top-1/2 left-4 -translate-y-1/2 stroke-[3px]" size={20} />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="CODENAME (EMAIL)"
                            className="w-full h-14 bg-white border-4 border-black pl-12 pr-4 font-bold placeholder:text-black/30 focus:outline-none focus:bg-neo-yellow transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute top-1/2 left-4 -translate-y-1/2 stroke-[3px]" size={20} />
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="PASSPHRASE"
                            className="w-full h-14 bg-white border-4 border-black pl-12 pr-4 font-bold placeholder:text-black/30 focus:outline-none focus:bg-neo-yellow transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-neo-red/10 border-4 border-neo-red p-3 flex items-center gap-2 font-bold text-neo-red text-sm">
                            <AlertTriangle className="stroke-[3px]" size={18} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-neo-red border-4 border-black h-14 flex items-center justify-center font-black uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : (isLogin ? "Unlock System" : "Join Network")}
                    </button>
                </form>

                <div className="mt-8 text-center bg-neo-yellow border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-bold text-sm uppercase mb-2">Status Unknown?</p>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                        }}
                        className="font-black underline decoration-4 underline-offset-4 hover:text-white transition-colors"
                    >
                        {isLogin ? "Request Clearance (Register)" : "Identify Yourself (Login)"}
                    </button>
                </div>
            </div>
        </div>
    );
}
