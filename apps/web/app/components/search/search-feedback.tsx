import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

interface SearchFeedbackProps {
  searchId: string;
  onFeedback: (searchId: string, sentiment: "positive" | "negative", feedback?: string) => Promise<void>;
  className?: string;
}

export function SearchFeedback({ searchId, onFeedback, className }: SearchFeedbackProps) {
  const [_sentiment, setSentiment] = useState<"positive" | "negative" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackText, setShowFeedbackText] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleThumbsUp = async () => {
    setIsSubmitting(true);
    try {
      await onFeedback(searchId, "positive");
      setSentiment("positive");
      setShowFeedbackText(false);
      setShowThanks(true);
      setIsComplete(true);
    } catch (error) {
      console.error("Failed to submit positive feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbsDown = async () => {
    setSentiment("negative");
    setShowFeedbackText(true);
  };

  const handleNegativeFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onFeedback(searchId, "negative", feedback);
      setShowFeedbackText(false);
      setShowThanks(true);
      setIsComplete(true);
    } catch (error) {
      console.error("Failed to submit negative feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showThanks) {
      const timer = setTimeout(() => {
        setShowThanks(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showThanks]);

  // Reset state when searchId changes (new search)
  useEffect(() => {
    setIsComplete(false);
    setSentiment(null);
    setFeedback("");
    setShowFeedbackText(false);
    setShowThanks(false);
  }, [searchId]);

  if (showThanks) {
    return (
      <div 
        className={`flex items-center gap-2 text-sm transition-all duration-1000 ease-out transform ${showThanks ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'} ${className}`} 
        style={{color: 'hsl(var(--success))'}}
      >
        <ThumbsUp size={16} className="fill-current" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  // If feedback is complete, don't show anything
  if (isComplete) {
    return null;
  }

  if (showFeedbackText) {
    return (
      <div className={`flex flex-col gap-3 animate-in slide-in-from-top-2 fade-in duration-300 ${className}`}>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What could be better about these search results?"
          className="glass-content text-content-text-primary min-h-[80px] text-sm focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleNegativeFeedbackSubmit}
            disabled={!feedback.trim() || isSubmitting}
            className="btn-primary cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
          <Button
            size="sm" 
            variant="outline"
            onClick={() => {
              setShowFeedbackText(false);
              setSentiment(null);
            }}
            className="btn-secondary cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className={`flex items-center gap-2 !text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 ${className}`}>
      <span className="text-sm !text-muted-foreground" style={{ color: 'hsl(var(--muted-foreground)) !important' }}>Was this helpful?</span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleThumbsUp}
          disabled={isSubmitting}
          className="p-2 h-8 w-8 cursor-pointer !text-muted-foreground rounded transition-colors"
          style={{ color: 'hsl(var(--muted-foreground)) !important' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
            e.currentTarget.style.color = 'rgb(34, 197, 94)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
          }}
        >
          <ThumbsUp size={14} />
        </button>
        <button
          type="button"
          onClick={handleThumbsDown}
          disabled={isSubmitting}
          className="p-2 h-8 w-8 cursor-pointer !text-muted-foreground rounded transition-colors"
          style={{ color: 'hsl(var(--muted-foreground)) !important' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = 'rgb(239, 68, 68)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
          }}
        >
          <ThumbsDown size={14} />
        </button>
      </div>
    </div>
  );
}