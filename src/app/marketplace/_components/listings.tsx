import { ListingType } from "@/lib/types";
import React from "react";
import ListingItem from "./listing-item";

const Listings = (listings: ListingType[]) => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
      {listings.map((listing) => ListingItem(listing))}
    </section>
  );
};

export default Listings;
