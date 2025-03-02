import { openDB } from "@/lib/db";
import { ListingType } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";

type MarketPlaceContextType = {
  listings: ListingType[];
  addListing: (listing: ListingType) => void;
  deleteListing: (id: string) => void;
  updateListing: (id: string, listing: Partial<ListingType>) => void;
  getListingById: (id: string) => ListingType | undefined;
  loading: boolean;
};

const MarketPlaceContext = createContext<MarketPlaceContextType | undefined>(
  undefined
);

export const ListingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchListings = async () => {
    //   try {
    //     //simulate API call
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    //     const savedListings = localStorage.getItem("biztoso_listings");
    //     if (savedListings) {
    //       setListings(JSON.parse(savedListings));
    //     } else {
    //       const sampleListings: ListingType[] = [
    //         {
    //           id: generateId(),
    //           title: "Professional Web Design Services",
    //           description:
    //             "Custom web design services for small businesses. Includes responsive design, SEO optimization, and content management system.",
    //           price: 1500,
    //           category: "Services",
    //           images: [new File([""], "placeholder.svg")],
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //           status: "active",
    //           ownerId: "sample-owner-1",
    //         },
    //         {
    //           id: generateId(),
    //           title: "Marketing Consultation Package",
    //           description:
    //             "Comprehensive marketing consultation for startups and small businesses. Includes market analysis, competitor research, and marketing strategy development.",
    //           price: 800,
    //           category: "Services",
    //           images: [new File([""], "placeholder.svg")],
    //           createdAt: new Date(),
    //           updatedAt: new Date(),
    //           status: "active",
    //           ownerId: "sample-owner-2",
    //         },
    //       ];

    //       setListings(sampleListings);
    //       localStorage.setItem(
    //         "biztoso_listings",
    //         JSON.stringify(sampleListings)
    //       );
    //     }
    //   } catch (err) {
    //     console.error("Failed to fetch listings", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchListings();
    fetchListingsWithImages();
  }, []);

  const addListing = async (listing: ListingType) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { id, images } = listing;

    const db = await openDB();
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    await Promise.all(
      images.map(async (file, index) => {
        store.put({ id: `${id}_${index}`, file });
      })
    );

    const listingWithoutImages = { ...listing, images: [] };
    const updatedListings = [...listings, listingWithoutImages];

    setListings(updatedListings);
    localStorage.setItem("biztoso_listings", JSON.stringify(updatedListings));
  };

  const fetchListingsWithImages = async () => {
    try {
      // Retrieve listings from localStorage
      const listingsFromStorage = JSON.parse(
        localStorage.getItem("biztoso_listings") ?? "[]"
      );

      if (!listingsFromStorage.length) {
        setListings([]);
        return;
      }

      // Open IndexedDB and access the images store
      const db = await openDB();
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");

      // Fetch images for each listing
      const listingsWithImages = await Promise.all(
        listingsFromStorage.map(async (listing) => {
          const images: File[] = [];

          for (let i = 0; true; i++) {
            const request = store.get(`${listing.id}_${i}`);
            const result = await new Promise((resolve) => {
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => resolve(null);
            });

            if (!result) break; // Stop fetching if no more images exist
            images.push(result.file);
          }

          return {
            ...listing,
            createdAt: new Date(listing.createdAt), // ✅ Convert string to Date
            updatedAt: new Date(listing.updatedAt), // ✅ Convert string to Date,
            images,
          };
        })
      );

      // Update state with the listings that now include images
      setListings(listingsWithImages);
    } catch (err) {
      console.error("Failed to fetch listings with images", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async (id) => {
    const db = await openDB();
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    // Delete all images associated with the listing
    for (let i = 0; true; i++) {
      const request = store.get(`${id}_${i}`);
      const result = await new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });

      if (!result) break;
      store.delete(`${id}_${i}`);
    }

    const updatedListings = listings.filter((listing) => listing.id !== id);
    setListings(updatedListings);
    localStorage.setItem("biztoso_listings", JSON.stringify(updatedListings));
  };

  const updateListing = async (id: string, updatedData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const db = await openDB();
    const transaction = db.transaction("images", "readwrite");
    const store = transaction.objectStore("images");

    if (updatedData.images) {
      // Remove old images
      for (let i = 0; true; i++) {
        const request = store.get(`${id}_${i}`);
        const result = await new Promise((resolve) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(null);
        });
        if (!result) break;
        store.delete(`${id}_${i}`);
      }

      // Add new images
      await Promise.all(
        updatedData.images.map((file, index) => {
          store.put({ id: `${id}_${index}`, file });
        })
      );
    }

    const updatedListings = listings.map((l) =>
      l.id === id ? { ...l, ...updatedData, images: [] } : l
    );

    setListings(updatedListings);
    localStorage.setItem("biztoso_listings", JSON.stringify(updatedListings));
  };

  const getListingById = (id: string) => listings.find((l) => l.id === id);
  return (
    <MarketPlaceContext.Provider
      value={{
        listings,
        addListing,
        deleteListing,
        updateListing,
        getListingById,
        loading,
      }}
    >
      {children}
    </MarketPlaceContext.Provider>
  );
};
export function useListing() {
  const context = useContext(MarketPlaceContext);
  if (!context) {
    throw new Error("useMarketPlace must be used within a ListingProvider");
  }
  return context;
}
