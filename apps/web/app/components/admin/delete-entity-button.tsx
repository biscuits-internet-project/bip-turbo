import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

interface DeleteEntityButtonProps {
  entityId: string;
  /** Display name shown in the dialog and the accessible label. */
  entityName: string;
  /** Lowercase noun for sentences, e.g. "instrument" or "author". */
  entityLabel: string;
  /** Admin endpoint that accepts `DELETE` with a JSON `{ id }` body. */
  endpoint: string;
  /** Runs only on a successful delete — revalidate the list, or navigate away. */
  onDeleted: () => void;
  variant?: "icon" | "button";
}

/**
 * Deletes an admin entity via its admin API behind a confirm dialog, surfacing
 * the server's in-use guard (HTTP 400) as an error toast. Shared by the admin
 * index rows (icon) and edit pages (full button); `onDeleted` lets each caller
 * decide what happens next.
 */
export function DeleteEntityButton({
  entityId,
  entityName,
  entityLabel,
  endpoint,
  onDeleted,
  variant = "icon",
}: DeleteEntityButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const titleLabel = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entityId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || `Failed to delete ${entityLabel}`);
        return;
      }

      toast.success(`${titleLabel} deleted`);
      onDeleted();
    } catch {
      toast.error(`Failed to delete ${entityLabel}`);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label={`Delete ${entityName}`}
          className="h-auto w-auto p-0.5 text-content-text-secondary hover:text-red-400 hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button variant="destructiveOutline" onClick={() => setIsOpen(true)} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete {titleLabel}
        </Button>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title={`Delete ${titleLabel}`}
        description={`Delete "${entityName}"? This can't be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
      />
    </>
  );
}
