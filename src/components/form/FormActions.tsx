import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isSubmitting: boolean;
  submitLabel: string;
  loadingLabel?: string;
  onCancel: () => void;
}

export default function FormActions({
  isSubmitting,
  submitLabel,
  loadingLabel,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}>
        Annulla
      </Button>
      <Button type="submit" disabled={isSubmitting} className="flex-1">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel || "Caricamento..."}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
