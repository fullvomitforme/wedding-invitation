"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

type Props = {
  weddingId: string;
  initialTemplateId: string;
  onUnsaved?: () => void;
  onSaved?: () => void;
};

export function TemplateForm({ weddingId, initialTemplateId, onUnsaved, onSaved }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(initialTemplateId);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setSelectedId(initialTemplateId);
    setHasChanges(false);
  }, [initialTemplateId]);

  const handleSelect = async (templateId: string) => {
    setSelectedId(templateId);
    setHasChanges(true);
    onUnsaved?.();
    setSaving(true);

    try {
      const res = await fetch(`/api/weddings/${weddingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: templateId }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Failed to update template";
        toast.error(msg);
        setHasChanges(true);
        return;
      }

      toast.success("Template updated.");
      setHasChanges(false);
      onSaved?.();
      // Refresh the page data to get updated template_id
      router.refresh();
    } catch {
      toast.error("Failed to update template");
      setHasChanges(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TEMPLATES.map((template) => {
          const isSelected = selectedId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              disabled={saving}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-border/50"
              } ${saving ? "opacity-50 pointer-events-none" : ""}`}
              type="button"
              aria-pressed={isSelected}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e5e5' width='100' height='100'/%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-card">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                  </div>
                  {hasChanges && isSelected && (
                    <span className="text-[10px] text-amber-500">Unsaved</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {saving && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Saving template selection...</span>
        </div>
      )}
    </div>
  );
}
