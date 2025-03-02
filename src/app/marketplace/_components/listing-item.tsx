import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ListingStatus, ListingType } from "@/lib/types";
import { mapListingStatusToColor } from "@/lib/utils";

const ListingItem = (listing: ListingType) => {
  const newPreviews = listing.images.map((image) => URL.createObjectURL(image));
  return (
    <Card key={listing.id}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
        <div className="flex items-center">
          <p className="text-sm text-gray-500">{listing.category}</p>
          <span className="mx-1">•</span>
          <p className="text-sm text-gray-500">${listing.price}</p>
        </div>
        <CardDescription>{listing.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Image
            src={newPreviews[0]}
            alt={listing.title}
            className="w-full h-48 object-cover rounded-lg"
            width={100}
            height={100}
          />
          <Badge
            className={`${mapListingStatusToColor(
              listing.status as ListingStatus
            )} absolute top-2 right-2`}
          >
            {listing.status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-500">
          <Link href={`/marketplace/${listing.id}`}>View Listing</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingItem;
