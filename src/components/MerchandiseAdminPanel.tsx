"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatKes } from "@/lib/content";
import type { MerchandiseProductRecord } from "@/lib/merchandise-data";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  publicUrl?: string | null;
};

type MerchandiseAdminPanelProps = {
  products: MerchandiseProductRecord[];
};

const emptyProduct: MerchandiseProductRecord = {
  id: "",
  slug: "",
  name: "",
  category: "Merchandise",
  description: "",
  imageUrl: "",
  price: 1500,
  stockQuantity: 0,
  status: "DRAFT",
  featured: false,
  causeLabel: "Supports Heart to Heart Foundation programmes"
};

export function MerchandiseAdminPanel({ products }: MerchandiseAdminPanelProps) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<MerchandiseProductRecord>(emptyProduct);
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });
  const isEditing = Boolean(selectedProduct.id);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)),
    [products]
  );

  function updateSelectedProduct(field: keyof MerchandiseProductRecord, value: string | number | boolean) {
    setSelectedProduct((current) => ({ ...current, [field]: value }));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting", message: "Saving product..." });

    try {
      const response = await fetch("/api/admin/merchandise", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct)
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string; publicUrl?: string | null };
      if (!response.ok || !result.ok) {
        setState({ status: "error", message: result.message || "Product could not be saved." });
        return;
      }
      setState({ status: "success", message: result.nextAction || "Product saved.", publicUrl: result.publicUrl });
      setSelectedProduct(emptyProduct);
      router.refresh();
    } catch {
      setState({ status: "error", message: "Product could not be saved right now." });
    }
  }

  async function deleteProduct(product: MerchandiseProductRecord) {
    if (!confirm(`Delete ${product.name}? This removes it from the shop.`)) return;
    setState({ status: "submitting", message: "Deleting product..." });

    try {
      const response = await fetch(`/api/admin/merchandise?id=${encodeURIComponent(product.id)}&slug=${encodeURIComponent(product.slug)}`, {
        method: "DELETE"
      });
      const result = (await response.json()) as { ok?: boolean; message?: string; nextAction?: string };
      if (!response.ok || !result.ok) {
        setState({ status: "error", message: result.message || "Product could not be deleted." });
        return;
      }
      setState({ status: "success", message: result.nextAction || "Product deleted." });
      if (selectedProduct.id === product.id) setSelectedProduct(emptyProduct);
      router.refresh();
    } catch {
      setState({ status: "error", message: "Product could not be deleted right now." });
    }
  }

  return (
    <section className="adminDashboardGrid merchandiseAdminLayout">
      <article className="appPanel span5 contentEditorPanel" id="product-editor">
        <div className="panelHeader editorPanelHeader">
          <div>
            <p className="eyebrow">{isEditing ? "Edit product" : "New product"}</p>
            <h2>{isEditing ? selectedProduct.name : "Add merchandise item"}</h2>
            <span>Set pricing, stock, cause messaging, and whether the product is live in the public shop.</span>
          </div>
        </div>
        <form className="contentAdminForm" onSubmit={saveProduct}>
          <label><span>Name</span><input value={selectedProduct.name} onChange={(event) => updateSelectedProduct("name", event.target.value)} placeholder="Heart Run T-shirt" required /></label>
          <label><span>Slug</span><input value={selectedProduct.slug} onChange={(event) => updateSelectedProduct("slug", event.target.value)} placeholder="Optional, generated from name" /></label>
          <label><span>Category</span><input value={selectedProduct.category} onChange={(event) => updateSelectedProduct("category", event.target.value)} placeholder="Apparel" required /></label>
          <label><span>Price</span><input min="100" type="number" value={selectedProduct.price} onChange={(event) => updateSelectedProduct("price", Number(event.target.value))} required /></label>
          <label><span>Stock</span><input min="0" type="number" value={selectedProduct.stockQuantity} onChange={(event) => updateSelectedProduct("stockQuantity", Number(event.target.value))} required /></label>
          <label><span>Status</span><select value={selectedProduct.status} onChange={(event) => updateSelectedProduct("status", event.target.value)}><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select></label>
          <label className="wide"><span>Image path or URL</span><input value={selectedProduct.imageUrl} onChange={(event) => updateSelectedProduct("imageUrl", event.target.value)} placeholder="/assets/hero/DSC_0634-scaled.jpg" /></label>
          <label className="wide"><span>Cause label</span><input value={selectedProduct.causeLabel} onChange={(event) => updateSelectedProduct("causeLabel", event.target.value)} placeholder="Supports children awaiting heart care" /></label>
          <label className="wide"><span>Description</span><textarea value={selectedProduct.description} onChange={(event) => updateSelectedProduct("description", event.target.value)} placeholder="Describe the product and how its sale supports the foundation." required rows={5} /></label>
          <label className="checkboxLine wide"><input checked={selectedProduct.featured} onChange={(event) => updateSelectedProduct("featured", event.target.checked)} type="checkbox" /> Feature in the shop</label>
          <div className="wide formSubmitRow">
            <button className="primaryAction" disabled={state.status === "submitting"} type="submit">
              {state.status === "submitting" ? "Saving..." : isEditing ? "Update product" : "Create product"}
            </button>
            {isEditing ? <button className="panelLink buttonReset" type="button" onClick={() => setSelectedProduct(emptyProduct)}>Start new</button> : null}
            {state.message ? <small className={state.status === "error" ? "formError" : "formSuccess"}>{state.message}</small> : null}
            {state.publicUrl ? <a className="panelLink" href={state.publicUrl}>Open product</a> : null}
          </div>
        </form>
      </article>

      <article className="appPanel span7">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Inventory control</p>
            <h2>Products in the shop</h2>
          </div>
          <a className="panelLink" href="/shop">Preview shop</a>
        </div>
        {sortedProducts.length ? (
          <div className="merchandiseAdminList">
            {sortedProducts.map((product) => (
              <article className="merchandiseAdminCard" key={product.id}>
                <img src={product.imageUrl} alt="" />
                <div>
                  <span className={`status ${product.status === "ACTIVE" ? "success" : "warning"}`}>{product.status}</span>
                  <strong>{product.name}</strong>
                  <small>{product.category} · {product.causeLabel}</small>
                  <div className="merchandiseInventoryMeta">
                    <span>{formatKes(product.price)}</span>
                    <span className={product.stockQuantity <= 10 ? "lowStock" : ""}>{product.stockQuantity} in stock</span>
                    {product.featured ? <span>Featured</span> : null}
                  </div>
                </div>
                <div className="merchandiseAdminActions">
                  <button className="panelLink buttonReset" type="button" onClick={() => setSelectedProduct(product)}>Edit</button>
                  <a className="panelLink" href={`/shop/${product.slug}`}>View</a>
                  <button className="dangerIconButton" aria-label={`Delete ${product.name}`} type="button" onClick={() => deleteProduct(product)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="adminEmptyState">
            <strong>No merchandise yet</strong>
            <span>Add your first product, set stock, and publish it when ready.</span>
          </div>
        )}
      </article>
    </section>
  );
}
