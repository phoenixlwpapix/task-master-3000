"use client";

import { useState } from "react";
import { useQuery, useMutation, Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Plus, Trash2, Check, Star, ArrowRight, Zap, Skull, LogOut, User } from "lucide-react";
import { AuthForm } from "../components/AuthForm";

export default function Home() {
  return (
    <main className="min-h-screen text-black font-space">
      <AuthLoading>
        <div className="flex flex-col h-screen w-full items-center justify-center gap-6">
          <Star size={80} className="stroke-[3px] fill-neo-yellow animate-spin-slow" />
          <div className="font-black text-2xl uppercase tracking-widest animate-pulse">
            Loading System...
          </div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="flex flex-col min-h-screen w-full items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-12 left-12 hidden lg:block animate-spin-slow pointer-events-none opacity-20">
            <Star size={120} className="stroke-[3px] fill-neo-yellow" />
          </div>

          <div className="mb-12 text-center relative z-10 animate-fade-in-up">
            <div className="inline-block bg-neo-red border-4 border-black p-3 mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <Skull size={48} className="stroke-[3px] text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
              Task Master <br /><span className="text-neo-red text-stroke">3000</span>
            </h1>
            <p className="font-bold border-4 border-black bg-white px-4 py-2 inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Restricted Access. Credentials Required.
            </p>
          </div>

          <AuthForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <MainContent />
      </Authenticated>
    </main>
  );
}

function MainContent() {
  const { signOut } = useAuthActions();
  const [newTask, setNewTask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useQuery(api.users.currentUser);
  const tasks = useQuery(api.tasks.get);
  const addTask = useMutation(api.tasks.add);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  // Optimistic UI states
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [pendingCompletes, setPendingCompletes] = useState<Map<string, boolean>>(new Map());

  const handleToggle = async (id: any, currentStatus: boolean) => {
    // 1. Instant Visual Feedback
    setPendingCompletes(prev => new Map(prev).set(id, !currentStatus));

    // 2. Perform Mutation
    await toggleTask({ id });

    // 3. Clear Optimistic State (Let server data take over)
    setPendingCompletes(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  };

  const handleDelete = async (id: any) => {
    // 1. Instant Visual Feedback
    setDeletingIds(prev => new Set(prev).add(id));

    // 2. Wait for "Fall off" animation (600ms) to complete
    setTimeout(async () => {
      await removeTask({ id });
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await addTask({ text: newTask.trim() });
    setNewTask("");
    setIsSubmitting(false);
  };

  const completedCount = tasks ? tasks.filter((t) => t.isCompleted).length : 0;
  const totalCount = tasks ? tasks.length : 0;

  return (
    <div className="p-4 md:p-8 lg:p-12 pb-32 max-w-7xl mx-auto min-h-screen">
      {/* Decorative Elements */}
      <div className="fixed top-12 left-12 hidden xl:block animate-spin-slow pointer-events-none z-0 opacity-20">
        <Star size={120} className="stroke-[3px] fill-neo-yellow" />
      </div>
      <div className="fixed bottom-12 right-12 hidden xl:block pointer-events-none z-0 opacity-20 rotate-12">
        <Zap size={120} className="stroke-[3px] fill-neo-red" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Header & Stats - 手机端排在下方 */}
        <section className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
          {/* Main Title Card */}
          <div className="bg-neo-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-neo-red w-16 h-16 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Skull size={32} className="stroke-[3px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold uppercase tracking-widest text-sm bg-neo-yellow px-2 border-2 border-black inline-block w-fit mb-1 transform -rotate-2">
                  Neo-Brutal
                </span>
                <span className="font-black text-xl uppercase">
                  {totalCount === 0 ? "SLACKER" : totalCount > 5 ? "HOARDER" : "Task Master 3000"}
                </span>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-[0.85] tracking-tighter uppercase mb-6">
              Get <br />
              <span className="text-neo-red text-stroke">Shit</span> <br />
              Done.
            </h1>

            <p className="font-medium text-lg border-l-4 border-black pl-4 leading-tight">
              An unapologetic task manager for the bold. structure your chaos. dominate your day.
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-neo-violet border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-black text-3xl uppercase">Progress</h3>
              <Star className="fill-black animate-pulse" />
            </div>
            <div className="w-full bg-white h-8 border-4 border-black p-1">
              <div
                className="h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between font-bold text-xl font-mono">
              <span>{completedCount} DONE</span>
              <span>{totalCount} TOTAL</span>
            </div>
          </div>
        </section>

        {/* Right Column: Task List - 手机端排在上方 */}
        <section className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">

          {/* User Info Bar */}
          <div className="flex items-center justify-between gap-4 bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 min-w-0">
              <User className="stroke-[3px] flex-shrink-0" size={20} />
              <span className="font-bold text-sm uppercase tracking-tight truncate">
                {currentUser?.email || "Loading..."}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex-shrink-0 flex items-center gap-2 bg-neo-red border-4 border-black px-4 py-2 font-bold text-sm uppercase hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            >
              <LogOut className="stroke-[3px]" size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="relative group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="TYPE IT."
              className="w-full h-20 bg-white border-4 border-black px-6 text-2xl font-bold placeholder:text-black/30 focus:outline-none focus:bg-neo-yellow focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newTask.trim()}
              className="absolute right-3 top-3 bottom-3 bg-neo-red border-4 border-black px-6 flex items-center justify-center font-black uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-200 active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:right-4 group-focus-within:top-4 transition-all"
            >
              Add <Plus className="ml-2 stroke-[4px]" size={18} />
            </button>
          </form>

          {/* Tasks Container */}
          <div className="space-y-6">
            {tasks === undefined ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white border-4 border-black opacity-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              ))
            ) : tasks.length === 0 ? (
              // Empty State
              <div className="bg-neo-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-dashed">
                <div className="inline-block bg-neo-yellow border-4 border-black p-4 rounded-full mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ArrowRight size={48} className="stroke-[3px]" />
                </div>
                <h3 className="text-3xl font-black uppercase mb-2">NOTHING TO DESTROY.</h3>
                <p className="font-bold text-gray-500">BORING.</p>
              </div>
            ) : (
              tasks.map((task) => {
                // Determine status considering optimistic updates
                const isCompleted = pendingCompletes.has(task._id)
                  ? pendingCompletes.get(task._id)!
                  : task.isCompleted;

                return (
                  <div
                    key={task._id}
                    className={`group relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 
                    transition-shadow duration-200 
                    hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
                    ${isCompleted ? 'bg-gray-200 animate-destroy' : ''}
                    ${deletingIds.has(task._id) ? 'animate-delete' : ''}
                    `}
                  >
                    <button
                      onClick={() => handleToggle(task._id, isCompleted)}
                      className={`flex-shrink-0 w-8 h-8 border-4 border-black flex items-center justify-center transition-colors duration-200 ${isCompleted
                        ? 'bg-black shadow-none translate-x-[2px] translate-y-[2px]'
                        : 'bg-white hover:bg-neo-yellow shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]'
                        }`}
                    >
                      {isCompleted && <Check className="stroke-[5px] w-5 h-5 text-neo-yellow" />}
                    </button>

                    <span
                      className={`flex-grow text-xl font-bold uppercase tracking-tight transition-colors duration-300 ${isCompleted ? 'text-gray-500 scratched' : 'text-black'
                        }`}
                    >
                      {task.text}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(task._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 bg-white border-4 border-black text-black hover:bg-neo-red hover:text-white transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                      aria-label="Delete"
                    >
                      <Trash2 className="stroke-[3px]" size={20} />
                    </button>

                    {/* Decorative badge for completed items */}
                    {isCompleted && (
                      <div className="absolute -top-3 -right-2 bg-neo-yellow border-4 border-black px-2 py-0.5 text-xs font-black uppercase rotate-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] pointer-events-none animate-stomp z-20">
                        Done
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Footer / Marquee */}
      <footer className="fixed bottom-0 left-0 w-full bg-neo-yellow border-t-4 border-black py-3 overflow-hidden z-20">
        <div className="whitespace-nowrap animate-marquee font-black uppercase tracking-widest text-sm">
          Make it happen • No excuses • Just do it • Ship it • Build fast • Break things • Make it happen • No excuses • Just do it • Ship it • Build fast • Break things • Make it happen • No excuses • Just do it • Ship it • Build fast • Break things
        </div>
      </footer>

      {/* Marquee Animation */}
      <style jsx>{`
         @keyframes marquee {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
         .animate-marquee {
           display: inline-block;
           animation: marquee 20s linear infinite;
         }
       `}</style>
    </div>
  );
}
