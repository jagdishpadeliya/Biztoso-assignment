import { Building2, MessageSquare, ShoppingBag, Users } from "lucide-react";

const tiles = [
  {
    title: "Business Profile",
    shortDescription: "Create and manage your business profile",
    longDescription:
      "Showcase your business with a professional profile including logo, description, and contact information.",
    buttonTitle: "Manage Profile",
    icon: Building2,
    href: "/profile",
  },
  {
    title: "Messaging",
    shortDescription: "Connect with other businesses",
    longDescription:
      "Real-time messaging to communicate with potential clients and partners instantly.",
    buttonTitle: "View Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Marketplace",
    shortDescription: "List and manage your products/services",
    longDescription:
      "Create, update, and manage your product and service listings with multiple images and detailed descriptions.",
    buttonTitle: "View Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
  },
  {
    title: "Lead Generation",
    shortDescription: "Find and manage business leads",
    longDescription:
      "Discover potential business leads, filter by status, and track your progress with each contact.",
    buttonTitle: "Explore Leads",
    href: "/leads",
    icon: Users,
  },
];

const categories = [
  "Products",
  "Services",
  "Digital Goods",
  "Consulting",
  "Others",
];

const listingStatuses = ["Active", "Inactive", "Pending", "Sold"] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Accepted image MIME types
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export {
  categories,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  listingStatuses,
  tiles,
};
