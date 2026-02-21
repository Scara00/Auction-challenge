import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Save, X, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileHeader({
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onCancel,
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Torna alla home</span>
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Profilo Utente</h1>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Modifica
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Annulla
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salva
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
