import { z } from "zod";
import { businessProfileSchema, listingSchema } from "./schema";
import { listingStatuses } from "./constants";

type BusinessProfileType = z.infer<typeof businessProfileSchema>;
type ListingType = z.infer<typeof listingSchema>;
type ListingStatus = (typeof listingStatuses)[number];
type LeadType = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "closed" | "lost";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
};
export {
  type BusinessProfileType,
  type ListingType,
  type ListingStatus,
  type LeadType,
};
