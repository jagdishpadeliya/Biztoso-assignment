import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ListingStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to validate image file
export function validateImageFile(file: File): {
  valid: boolean;
  message?: string;
} {
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      message: "File must be an image (JPEG, PNG, GIF, or WEBP)",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, message: "Image size must be less than 5MB" };
  }

  return { valid: true };
}

export function generateId() {
  return (
    Math.random().toString(36).substr(2, 15) +
    Math.random().toString(36).substr(2, 15)
  );
}

export const mapListingStatusToColor = (status: ListingStatus) => {
  console.log(status);

  switch (status) {
    case "Active":
      return "bg-green-200 text-green-900 font-bold ";
    case "Pending":
      return "bg-yellow-200 text-yellow-900 font-bold";
    case "Inactive":
      return "bg-red-200 text-red-900 font-bold";
    default:
      return "bg-gray-200 text-gray-900 font-bold";
  }
};

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
