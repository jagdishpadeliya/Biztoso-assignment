"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/loader";
import { useListing } from "@/contexts/listing-context";

import Link from "next/link";
import Listings from "./_components/listings";
import { listingStatuses } from "@/lib/constants";
import SearchBar from "./_components/search-bar";
import { useEffect, useState } from "react";

const MarketplacePage = () => {
  const { listings, loading } = useListing();
  const [filteredListings, setFilteredListings] = useState(listings);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredListings(
      listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, listings]);

  const getListingsByStatus = (status: string) =>
    filteredListings.filter((listing) => listing.status === status);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Marketplace</h1>
          <p className="text-2xl text-gray-500">
            {" "}
            Manage your product and service listings
          </p>
        </div>
        <div>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-500">
            <Link href="/marketplace/new">Create New Listing</Link>
          </Button>
        </div>
      </div>
      <div className="my-5">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search for listings"
        />
      </div>
      <Tabs defaultValue="Active" className="mt-5">
        <TabsList className="py-6">
          {listingStatuses.map((status) => (
            <TabsTrigger value={status} key={status} className="text-lg px-3">
              {status} (
              {
                filteredListings.filter((listing) => listing.status === status)
                  .length
              }
              )
            </TabsTrigger>
          ))}
        </TabsList>
        {listingStatuses.map((status) => (
          <TabsContent value={status} key={status}>
            {getListingsByStatus(status).length ? (
              Listings(getListingsByStatus(status))
            ) : (
              <p className="text-center mt-5">
                No {status.toLowerCase()} listings available
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
};

export default MarketplacePage;
