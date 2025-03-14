import type { ReviewMinimal } from "@bip/domain";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { Textarea } from "~/components/ui/textarea";

interface ReviewCardProps {
  review: ReviewMinimal;
  currentUserId?: string;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, content: string) => Promise<void>;
}

export function ReviewCard({ review, currentUserId, onDelete, onUpdate }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOwner = currentUserId === review.userId;

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(review.id);
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdate = async () => {
    if (!onUpdate) return;
    setIsLoading(true);
    try {
      await onUpdate(review.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(review.content);
  };

  return (
    <>
      <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/80 overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20">
        <CardHeader className="border-b border-gray-800/50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-medium shadow-inner shadow-purple-950/50">
                {review.user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-gray-200">{review.user.username}</h3>
                <p className="text-sm text-gray-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
              </div>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-purple-300 hover:bg-purple-900/20 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-purple-300 hover:bg-purple-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-purple-300"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isLoading} className="bg-purple-500 hover:bg-purple-600">
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{review.content}</ReactMarkdown>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
