import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import type { Comment } from "@/types";
import { createComment, deleteComment, fetchComments, ApiRequestError } from "@/services/api";
import { useToast } from "@/hooks/useToast";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ReviewComments({ reviewId }: { reviewId: string }) {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commenterName, setCommenterName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchComments(reviewId)
      .then(setComments)
      .catch((err) => showToast(err instanceof ApiRequestError ? err.message : "Couldn't load comments.", "error"))
      .finally(() => setLoading(false));
  }, [open, reviewId, showToast]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!commenterName.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const comment = await createComment(reviewId, { commenterName: commenterName.trim(), content: content.trim() });
      setComments((current) => [...current, comment]);
      setContent("");
      showToast("Comment added!");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Couldn't add comment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (comment: Comment) => {
    try {
      await deleteComment(comment.id);
      setComments((current) => current.filter((item) => item.id !== comment.id));
      showToast("Comment removed.");
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Couldn't remove comment.", "error");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-rose-200/70 bg-white/65 p-3.5 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-rose-900">
          <MessageCircle className="h-4 w-4" /> Join the conversation
          {comments.length > 0 && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">{comments.length}</span>}
        </span>
        <span className="text-xs font-medium text-rose-600">{open ? "Hide" : "Comment"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 space-y-2.5">
              {loading ? (
                <div className="h-10 animate-pulse rounded-xl bg-rose-50" />
              ) : comments.length === 0 ? (
                <p className="rounded-xl bg-rose-50/70 px-3 py-2 text-xs text-rose-700/70">No comments yet. Be the first to add a thought.</p>
              ) : (
                comments.map((comment) => (
                  <motion.div key={comment.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5 rounded-xl bg-white/75 px-3 py-2.5">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-300 to-violet-300 text-[11px] font-bold text-white">{initials(comment.commenterName)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{comment.commenterName}</p>
                        <span className="text-[10px] text-slate-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{comment.content}</p>
                    </div>
                    <button type="button" onClick={() => remove(comment)} aria-label={`Delete comment by ${comment.commenterName}`} className="self-start rounded-full p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-[150px_1fr_auto]">
              <input value={commenterName} onChange={(e) => setCommenterName(e.target.value)} placeholder="Your name" maxLength={100} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100" />
              <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share a thought about this review…" maxLength={1000} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100" />
              <button disabled={submitting || !commenterName.trim() || !content.trim()} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
                <Send className="h-3.5 w-3.5" /> {submitting ? "Adding" : "Post"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
