"use client";

import { FormEvent, useState } from "react";

type FormResult = {
  ok?: boolean;
  message?: string;
  nextAction?: string;
  publicUrl?: string | null;
};

export function BlogPostForm() {
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
      excerpt: String(form.get("excerpt") || ""),
      body: String(form.get("body") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
      authorName: String(form.get("authorName") || ""),
      status: String(form.get("status") || "DRAFT")
    };

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as FormResult;
      setResult({ ...data, ok: response.ok && data.ok });
      if (response.ok && data.ok) event.currentTarget.reset();
    } catch (error) {
      setResult({ ok: false, message: "Blog post could not be created right now." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contentAdminForm" onSubmit={handleSubmit}>
      <label><span>Title</span><input name="title" placeholder="Foundation update title" required /></label>
      <label><span>Slug</span><input name="slug" placeholder="Optional, generated from title" /></label>
      <label><span>Category</span><input name="category" defaultValue="Foundation updates" /></label>
      <label><span>Author</span><input name="authorName" defaultValue="Heart to Heart Foundation" /></label>
      <label className="wide"><span>Hero image</span><input name="imageUrl" placeholder="/assets/hero/DSC_0634-scaled.jpg" /></label>
      <label className="wide"><span>Excerpt</span><textarea name="excerpt" placeholder="Short card summary" required rows={3} /></label>
      <label className="wide"><span>Body</span><textarea name="body" placeholder="Full blog story" required rows={8} /></label>
      <label><span>Status</span><select name="status" defaultValue="DRAFT"><option value="DRAFT">Save draft</option><option value="PUBLISHED">Publish now</option></select></label>
      <div className="wide formSubmitRow">
        <button className="primaryAction" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : "Create blog post"}</button>
        {result.message || result.nextAction ? <small className={result.ok ? "formSuccess" : "formError"}>{result.nextAction || result.message}</small> : null}
        {result.publicUrl ? <a className="panelLink" href={result.publicUrl}>Open public page</a> : null}
      </div>
    </form>
  );
}
