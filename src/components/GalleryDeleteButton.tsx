"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type GalleryDeleteButtonProps = {
  id: string;
  slug: string;
  title: string;
};

export function GalleryDeleteButton({ id, slug, title }: GalleryDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteImage() {
    const confirmed = window.confirm(`Delete "${title}" from this album?`);
    if (!confirmed) return;

    setIsDeleting(true);
    setMessage("");

    try {
      const params = new URLSearchParams({ id, slug });
      const response = await fetch(`/api/admin/galleries?${params.toString()}`, {
        method: "DELETE"
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; nextAction?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message || "Could not delete this image.");
        return;
      }

      setMessage(result.nextAction || "Image removed.");
      router.refresh();
    } catch (error) {
      setMessage("Could not delete this image.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        aria-label={`Delete ${title}`}
        className="adminGalleryDeleteButton"
        disabled={isDeleting}
        onClick={deleteImage}
        title="Delete image"
        type="button"
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
          <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM7 8h10l-.7 12H7.7L7 8Z" />
        </svg>
      </button>
      {message ? <small className="adminGalleryDeleteMessage">{message}</small> : null}
    </>
  );
}
