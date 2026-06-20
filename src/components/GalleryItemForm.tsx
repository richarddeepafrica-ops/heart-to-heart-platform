"use client";

import { FormEvent, useState } from "react";

type FormResult = {
  ok?: boolean;
  message?: string;
  nextAction?: string;
  publicUrl?: string | null;
};

type GalleryItemFormProps = {
  defaultCategory?: string;
  submitLabel?: string;
};

const galleryCategories = ["General", "Gala Dinner", "Teachers Workshop", "Heart Run"];

export function GalleryItemForm({ defaultCategory = "Heart Run", submitLabel = "Create gallery item" }: GalleryItemFormProps) {
  const [result, setResult] = useState<FormResult>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult({});

    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") || ""),
      slug: String(form.get("slug") || ""),
      category: String(form.get("category") || ""),
      description: String(form.get("description") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
      location: String(form.get("location") || ""),
      status: String(form.get("status") || "DRAFT")
    };

    try {
      const response = await fetch("/api/admin/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as FormResult;
      setResult({ ...data, ok: response.ok && data.ok });
      if (response.ok && data.ok) event.currentTarget.reset();
    } catch (error) {
      setResult({ ok: false, message: "Gallery item could not be created right now." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contentAdminForm" onSubmit={handleSubmit}>
      <label><span>Title</span><input name="title" placeholder="Gallery moment title" required /></label>
      <label><span>Slug</span><input name="slug" placeholder="Optional, generated from title" /></label>
      <label>
        <span>Album</span>
        <select name="category" defaultValue={defaultCategory}>
          {galleryCategories.map((category) => (
            <option value={category} key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label><span>Location</span><input name="location" placeholder="Nairobi, Karen Hospital..." /></label>
      <label className="wide"><span>Image</span><input name="imageUrl" placeholder="/assets/impact/CDB_6159-scaled.jpg" required /></label>
      <label className="wide"><span>Description</span><textarea name="description" placeholder="Tell visitors what is happening in this image." required rows={5} /></label>
      <label><span>Status</span><select name="status" defaultValue="DRAFT"><option value="DRAFT">Save draft</option><option value="PUBLISHED">Publish now</option></select></label>
      <div className="wide formSubmitRow">
        <button className="primaryAction" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : submitLabel}</button>
        {result.message || result.nextAction ? <small className={result.ok ? "formSuccess" : "formError"}>{result.nextAction || result.message}</small> : null}
        {result.publicUrl ? <a className="panelLink" href={result.publicUrl}>Open public page</a> : null}
      </div>
    </form>
  );
}
