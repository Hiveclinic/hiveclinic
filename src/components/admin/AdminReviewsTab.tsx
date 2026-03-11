import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Pencil, Save, X, Star } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  name: string;
  text: string;
  stars: number;
  source: string;
  active: boolean;
  created_at: string;
};

const AdminReviewsTab = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ name: "", text: "", stars: 5, source: "google" });

  const fetchReviews = async () => {
    // Admin can see all reviews (active and inactive) via RLS
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const createReview = async () => {
    if (!newReview.name.trim() || !newReview.text.trim()) { toast.error("Name and review text required"); return; }
    const { error } = await supabase.from("reviews").insert(newReview);
    if (error) { toast.error("Failed to add review"); return; }
    toast.success("Review added");
    setNewReview({ name: "", text: "", stars: 5, source: "google" });
    setShowNew(false);
    fetchReviews();
  };

  const updateReview = async (review: Review) => {
    const { error } = await supabase.from("reviews").update({
      name: review.name, text: review.text, stars: review.stars, source: review.source, active: review.active,
    }).eq("id", review.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Review updated");
    setEditingId(null);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("reviews").update({ active: !current }).eq("id", id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, active: !current } : r));
    toast.success(!current ? "Review visible" : "Review hidden");
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    setReviews(prev => prev.filter(r => r.id !== id));
    toast.success("Review deleted");
  };

  if (loading) return <div className="py-12 text-center"><p className="font-body text-muted-foreground animate-pulse">Loading reviews...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl">Reviews ({reviews.length})</h3>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1 px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">
          <Plus size={12} /> Add Review
        </button>
      </div>

      <p className="font-body text-xs text-muted-foreground mb-6">Add your Google reviews here. Active reviews are shown on the homepage.</p>

      {showNew && (
        <div className="border border-gold/30 bg-gold/5 p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-body text-sm font-medium">New Review</h4>
            <button onClick={() => setShowNew(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={newReview.name} onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
              className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" placeholder="Reviewer name e.g. Aisha M." />
            <div className="flex gap-3 items-center">
              <select value={newReview.stars} onChange={e => setNewReview(p => ({ ...p, stars: Number(e.target.value) }))}
                className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none">
                {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
              </select>
              <select value={newReview.source} onChange={e => setNewReview(p => ({ ...p, source: e.target.value }))}
                className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none">
                <option value="google">Google</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
          <textarea value={newReview.text} onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))} rows={3}
            className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none resize-none"
            placeholder="Paste the review text here..." />
          <button onClick={createReview} className="px-4 py-2 bg-foreground text-background font-body text-xs uppercase tracking-wider hover:bg-accent transition-colors">Add Review</button>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="p-12 bg-secondary text-center"><p className="font-body text-muted-foreground">No reviews yet. Add your first Google review above.</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => (
            <div key={review.id} className={`border p-4 transition-colors ${review.active ? "border-border" : "border-border/50 opacity-60"}`}>
              {editingId === review.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={review.name} onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, name: e.target.value } : r))}
                      className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none" />
                    <select value={review.stars} onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, stars: Number(e.target.value) } : r))}
                      className="border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none">
                      {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
                    </select>
                  </div>
                  <textarea value={review.text} onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, text: e.target.value } : r))} rows={3}
                    className="w-full border border-border bg-transparent px-3 py-2 font-body text-sm focus:border-gold focus:outline-none resize-none" />
                  <div className="flex gap-2">
                    <button onClick={() => updateReview(review)} className="px-3 py-1 bg-foreground text-background font-body text-xs hover:bg-accent transition-colors"><Save size={10} className="inline mr-1" /> Save</button>
                    <button onClick={() => { setEditingId(null); fetchReviews(); }} className="px-3 py-1 border border-border font-body text-xs hover:border-foreground transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <span className="font-body text-sm font-medium">{review.name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.stars }).map((_, i) => (
                        <Star key={i} size={12} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{review.source}</span>
                    <div className="sm:ml-auto flex gap-2">
                      <button onClick={() => toggleActive(review.id, review.active)} className={`px-2 py-1 border font-body text-xs transition-colors ${review.active ? "border-green-600/30 text-green-600" : "border-border text-muted-foreground"}`}>
                        {review.active ? "Visible" : "Hidden"}
                      </button>
                      <button onClick={() => setEditingId(review.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => deleteReview(review.id)} className="px-2 py-1 border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <p className="font-body text-xs text-foreground/80 italic">"{review.text}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsTab;
