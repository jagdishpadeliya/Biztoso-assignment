"use client";

import { LeadsProvider } from "@/contexts/lead-context";
import { ListingProvider } from "@/contexts/listing-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { useEffect, useState } from "react";

export const Providers = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ProfileProvider>
      <ListingProvider>
        <LeadsProvider>{children}</LeadsProvider>
      </ListingProvider>
    </ProfileProvider>
  );
};
