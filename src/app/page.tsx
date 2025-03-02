import Image from "next/image";
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
import { tiles } from "@/lib/constants";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="mb-10">
        <h1 className="text-5xl font-bold">Welcome to Biztoso</h1>
        <p className="text-2xl text-gray-500 mt-2">
          Your all-in-one platform for business networking and marketplace
          functionality
        </p>
      </div>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile, index) => (
          <Card key={`${tile.title}-${index}`}>
            <CardHeader>
              {tile.icon ? (
                <tile.icon className="text-blue-600" size={32} />
              ) : null}
              <CardTitle className="text-2xl font-bold">{tile.title}</CardTitle>
              <CardDescription>{tile.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{tile.longDescription}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer">
                <Link href={tile.href}>{tile.buttonTitle}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
}
