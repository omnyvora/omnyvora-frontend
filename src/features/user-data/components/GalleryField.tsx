"use client";

import { useRef } from "react";
import { Plus, Star, X } from "lucide-react";
import { toast } from "sonner";
import { describeApiError } from "@/core/utils/applyServerErrors";
import {
  useAddProjectImage,
  useRemoveProjectImage,
  useReorderProjectImages,
  useSetProjectCoverImage,
  useUpdateProjectImageCaption,
} from "../hooks";
import { useDragReorder } from "../useDragReorder";
import type { ProjectImageUI } from "../transformers";

interface GalleryFieldProps {
  projectId: number | null;
  images:    ProjectImageUI[];
}

// Images are scoped to an already-saved project (the backend needs a project_id
// to attach an upload to) — unlike the rest of the form, gallery edits are live:
// each action calls its own mutation immediately, independent of "Save project".
export function GalleryField({ projectId, images }: GalleryFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage      = useAddProjectImage();
  const removeImage    = useRemoveProjectImage();
  const setCover        = useSetProjectCoverImage();
  const updateCaption  = useUpdateProjectImageCaption();
  const reorder          = useReorderProjectImages();

  const orderedIds = images.map((i) => i.id);
  const drag = useDragReorder(orderedIds, (ids) => {
    if (projectId) reorder.mutate({ projectId, orderedIds: ids });
  });

  if (!projectId) {
    return (
      <div className="field">
        <label className="label">Images</label>
        <div className="ds-caption" style={{ color: "var(--text-tertiary)" }}>
          Save the project first, then come back to add photos.
        </div>
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !projectId) return;
    addImage.mutate(
      { projectId, file },
      { onError: (err) => toast.error("Upload failed", { description: describeApiError(err) }) },
    );
  }

  return (
    <div className="field">
      <label className="label">Images</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 14 }}>
        {images.map((im, i) => (
          <div
            key={im.id}
            draggable
            onDragStart={drag.onDragStart(i)}
            onDragOver={drag.onDragOver(i)}
            onDrop={drag.onDrop(i)}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={im.url}
                alt={im.caption || "Project image"}
                style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block", borderRadius: "var(--radius-card)", border: "0.5px solid var(--border-default)" }}
              />
              <button
                type="button"
                title="Remove image"
                onClick={() => removeImage.mutate({ projectId, imageId: im.id })}
                style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(17,17,17,0.55)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={12} />
              </button>
              <button
                type="button"
                title={im.isCover ? "Cover image" : "Set as cover"}
                onClick={() => setCover.mutate({ projectId, imageId: im.id })}
                style={{
                  position: "absolute", bottom: 6, left: 6, height: 22, padding: "0 8px", borderRadius: "var(--radius-pill)",
                  border: "none", cursor: "pointer", background: im.isCover ? "var(--accent-primary)" : "rgba(17,17,17,0.55)",
                  color: "#fff", font: "500 10px var(--font-sans)", display: "inline-flex", alignItems: "center", gap: 4,
                }}
              >
                <Star size={11} />{im.isCover ? "Cover" : "Set cover"}
              </button>
            </div>
            <input
              defaultValue={im.caption}
              onBlur={(e) => {
                if (e.target.value !== im.caption) updateCaption.mutate({ projectId, imageId: im.id, caption: e.target.value });
              }}
              placeholder="Caption"
              className="input"
              style={{ height: 32, font: "400 12px var(--font-sans)", padding: "0 8px" }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={addImage.isPending}
          style={{
            aspectRatio: "1/1", borderRadius: "var(--radius-card)", border: "1px dashed var(--border-strong)",
            background: "transparent", color: "var(--text-tertiary)", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <Plus size={18} /><span className="ds-caption">{addImage.isPending ? "Uploading…" : "Add image"}</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />
      </div>
    </div>
  );
}
