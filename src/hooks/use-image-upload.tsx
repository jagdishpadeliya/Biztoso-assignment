"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { validateImageFile } from "@/lib/utils";

export function useImageUpload(initialImage?: string) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);

      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.message || "Invalid file");
        return;
      }

      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);

        // Simulate network delay for upload
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
      };
      reader.onerror = () => {
        setUploadError("Error reading file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  return {
    imagePreview,
    setImagePreview,
    isUploading,
    handleImageChange,
    uploadError,
  };
}
