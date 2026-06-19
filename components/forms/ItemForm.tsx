"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { itemSchema } from "@/lib/validations";
import {
  CONDITIONS,
  CONDITION_LABELS,
  PICKUP_LOCATIONS,
  ITEM_TAGS,
} from "@/lib/constants";

interface ImagePreview {
  id: string;
  file: File | null;
  url: string;
}

interface ItemFormData {
  title: string;
  description: string;
  categoryId: string;
  brand: string;
  size: string;
  condition: string;
  dailyPrice: string;
  deposit: string;
  pickupLocation: string;
  returnLocation: string;
  availableFrom: string;
  availableTo: string;
  safetyNotes: string;
  tags: string[];
  isHillwalkingRecommended: boolean;
}

interface ItemFormProps {
  initialData?: Partial<{
    title: string;
    description: string;
    categoryId: string;
    brand: string | null;
    size: string | null;
    condition: string;
    dailyPrice: number | string;
    deposit: number | string;
    pickupLocation: string;
    returnLocation: string | null;
    availableFrom: string;
    availableTo: string;
    safetyNotes: string | null;
    tags: string[] | string;
    isHillwalkingRecommended: boolean;
    images?: string;
  }>;
  initialImages?: string[];
  categories?: { id: string; name: string }[];
  isEditing?: boolean;
  itemId?: string;
}

const emptyForm: ItemFormData = {
  title: "",
  description: "",
  categoryId: "",
  brand: "",
  size: "",
  condition: "LIGHTLY_USED",
  dailyPrice: "",
  deposit: "",
  pickupLocation: "SCIE Antuoshan Campus",
  returnLocation: "",
  availableFrom: "",
  availableTo: "",
  safetyNotes: "",
  tags: [],
  isHillwalkingRecommended: false,
};

export default function ItemForm({
  initialData,
  initialImages = [],
  categories = [
    { id: "1", name: "Boots & Footwear" },
    { id: "2", name: "Backpacks" },
    { id: "3", name: "Tents & Shelters" },
    { id: "4", name: "Sleeping Bags & Pads" },
    { id: "5", name: "Clothing & Layers" },
    { id: "6", name: "Cooking Equipment" },
    { id: "7", name: "Navigation & Safety" },
    { id: "8", name: "Climbing Gear" },
    { id: "9", name: "Lighting" },
    { id: "10", name: "Other" },
  ],
  isEditing = false,
  itemId,
}: ItemFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ItemFormData>(() => {
    const data = { ...emptyForm };
    if (initialData) {
      if (initialData.title !== undefined) data.title = initialData.title;
      if (initialData.description !== undefined) data.description = initialData.description;
      if (initialData.categoryId !== undefined) data.categoryId = initialData.categoryId;
      if (initialData.brand != null) data.brand = initialData.brand;
      if (initialData.size != null) data.size = initialData.size;
      if (initialData.condition !== undefined) data.condition = initialData.condition;
      if (initialData.dailyPrice !== undefined) data.dailyPrice = String(initialData.dailyPrice);
      if (initialData.deposit !== undefined) data.deposit = String(initialData.deposit);
      if (initialData.pickupLocation !== undefined) data.pickupLocation = initialData.pickupLocation;
      if (initialData.returnLocation != null) data.returnLocation = initialData.returnLocation;
      if (initialData.availableFrom !== undefined) data.availableFrom = initialData.availableFrom;
      if (initialData.availableTo !== undefined) data.availableTo = initialData.availableTo;
      if (initialData.safetyNotes != null) data.safetyNotes = initialData.safetyNotes;
      if (initialData.isHillwalkingRecommended !== undefined) data.isHillwalkingRecommended = initialData.isHillwalkingRecommended;
      if (initialData.tags !== undefined) {
        if (Array.isArray(initialData.tags)) {
          data.tags = initialData.tags;
        } else if (typeof initialData.tags === "string") {
          try { data.tags = JSON.parse(initialData.tags); } catch { data.tags = []; }
        }
      }
    }
    return data;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>(
    initialImages.map((url, i) => ({
      id: `existing-${i}`,
      file: null,
      url,
    }))
  );

  const updateField = <K extends keyof ItemFormData>(
    key: K,
    value: ItemFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleImageAdd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];
    for (let i = 0; i < Math.min(files.length, 6 - images.length); i++) {
      const file = files[i];
      newImages.push({
        id: `${Date.now()}-${i}`,
        file,
        url: URL.createObjectURL(file),
      });
    }
    setImages((prev) => [...prev, ...newImages].slice(0, 6));
    e.target.value = "";
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      const newImages: ImagePreview[] = [];
      for (let i = 0; i < Math.min(files.length, 6 - images.length); i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          newImages.push({
            id: `${Date.now()}-${i}`,
            file,
            url: URL.createObjectURL(file),
          });
        }
      }
      setImages((prev) => [...prev, ...newImages].slice(0, 6));
    },
    [images.length]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = itemSchema.safeParse({
      ...form,
      dailyPrice: parseFloat(form.dailyPrice) || 0,
      deposit: parseFloat(form.deposit) || 0,
      isHillwalkingRecommended: form.isHillwalkingRecommended,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("categoryId", form.categoryId);
      if (form.brand) formData.append("brand", form.brand);
      if (form.size) formData.append("size", form.size);
      formData.append("condition", form.condition);
      formData.append("dailyPrice", String(parseFloat(form.dailyPrice) || 0));
      formData.append("deposit", String(parseFloat(form.deposit) || 0));
      formData.append("pickupLocation", form.pickupLocation);
      if (form.returnLocation) formData.append("returnLocation", form.returnLocation);
      formData.append("availableFrom", form.availableFrom);
      formData.append("availableTo", form.availableTo);
      if (form.safetyNotes) formData.append("safetyNotes", form.safetyNotes);
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("isHillwalkingRecommended", String(form.isHillwalkingRecommended));

      // Append new images
      images.forEach((img) => {
        if (img.file) {
          formData.append("images", img.file);
        }
      });

      const url = isEditing && itemId ? `/api/items/${itemId}` : "/api/items";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save item");
      }

      const saved = await res.json();
      router.push(`/items/${saved.id}`);
      router.refresh();
    } catch (err: unknown) {
      setErrors({
        form: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full h-10 px-3 bg-white border border-surface-dark rounded-xl text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-error mt-1";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      {errors.form && (
        <div className="p-4 rounded-xl bg-error-light border border-error/20 text-sm text-error">
          {errors.form}
        </div>
      )}

      {/* Title */}
      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Osprey Atmos 50L Backpack"
          className={fieldClass}
          maxLength={80}
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your gear, its condition, any notes for borrowers..."
          className={cn(fieldClass, "h-28 py-3 resize-y")}
          maxLength={2000}
        />
        <p className="text-xs text-muted-light mt-1">{form.description.length}/2000</p>
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </div>

      {/* Category & Brand & Size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className={fieldClass}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className={errorClass}>{errors.categoryId}</p>}
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => updateField("brand", e.target.value)}
            placeholder="e.g. Osprey"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Size</label>
          <input
            type="text"
            value={form.size}
            onChange={(e) => updateField("size", e.target.value)}
            placeholder="e.g. M, 50L"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className={labelClass}>Condition *</label>
        <select
          value={form.condition}
          onChange={(e) => updateField("condition", e.target.value)}
          className={fieldClass}
        >
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {CONDITION_LABELS[cond]}
            </option>
          ))}
        </select>
        {errors.condition && <p className={errorClass}>{errors.condition}</p>}
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Daily Price (¥) *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.dailyPrice}
            onChange={(e) => updateField("dailyPrice", e.target.value)}
            placeholder="0 = Free"
            className={fieldClass}
          />
          {errors.dailyPrice && <p className={errorClass}>{errors.dailyPrice}</p>}
        </div>
        <div>
          <label className={labelClass}>Deposit (¥) *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={form.deposit}
            onChange={(e) => updateField("deposit", e.target.value)}
            placeholder="0 = No deposit"
            className={fieldClass}
          />
          {errors.deposit && <p className={errorClass}>{errors.deposit}</p>}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Available From *</label>
          <input
            type="date"
            value={form.availableFrom}
            onChange={(e) => updateField("availableFrom", e.target.value)}
            className={fieldClass}
          />
          {errors.availableFrom && <p className={errorClass}>{errors.availableFrom}</p>}
        </div>
        <div>
          <label className={labelClass}>Available To *</label>
          <input
            type="date"
            value={form.availableTo}
            onChange={(e) => updateField("availableTo", e.target.value)}
            className={fieldClass}
          />
          {errors.availableTo && <p className={errorClass}>{errors.availableTo}</p>}
        </div>
      </div>

      {/* Locations */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Pickup Location *</label>
          <select
            value={form.pickupLocation}
            onChange={(e) => updateField("pickupLocation", e.target.value)}
            className={fieldClass}
          >
            {PICKUP_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          {errors.pickupLocation && <p className={errorClass}>{errors.pickupLocation}</p>}
        </div>
        <div>
          <label className={labelClass}>Return Location</label>
          <input
            type="text"
            value={form.returnLocation}
            onChange={(e) => updateField("returnLocation", e.target.value)}
            placeholder="Same as pickup if empty"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Safety Notes */}
      <div>
        <label className={labelClass}>Safety Notes</label>
        <textarea
          value={form.safetyNotes}
          onChange={(e) => updateField("safetyNotes", e.target.value)}
          placeholder="Any safety concerns or usage instructions..."
          className={cn(fieldClass, "h-20 py-3 resize-y")}
          maxLength={500}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {ITEM_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                form.tags.includes(tag)
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted-dark border-surface-dark hover:border-primary"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Hillwalking Recommended */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isHillwalkingRecommended}
            onChange={(e) =>
              updateField("isHillwalkingRecommended", e.target.checked)
            }
            className="w-5 h-5 rounded border-surface-darker text-primary focus:ring-primary/30"
          />
          <span className="text-sm font-medium text-foreground">
            Hillwalking Recommended
          </span>
        </label>
        <p className="text-xs text-muted mt-1 ml-8">
          Mark if this item is especially suitable for SCIE hillwalking trips
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Images (up to 6)</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-surface-darker rounded-xl p-6 text-center hover:border-primary-light hover:bg-primary-50/50 transition-colors"
        >
          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-surface group/img"
                >
                  <img
                    src={img.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-4">
              <ImageIcon className="w-10 h-10 text-muted-light" />
              <p className="text-sm text-muted">
                Drag and drop images here, or click to browse
              </p>
            </div>
          )}

          {images.length < 6 && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-dark rounded-lg text-sm text-muted-dark cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Upload Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </label>
          )}
        </div>
        <p className="text-xs text-muted-light mt-1">
          {images.length}/6 images. First image will be the cover.
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t border-surface-dark">
        <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading}>
          {isEditing ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
