"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListingType } from "@/lib/types";
import { listingSchema } from "@/lib/schema";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCEPTED_IMAGE_TYPES,
  categories,
  listingStatuses,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useListing } from "@/contexts/listing-context";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "@/components/loader";

const ListingForm = () => {
  const router = useRouter();
  const { addListing } = useListing();
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ListingType>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      images: [],
      status: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const currentFiles = form.getValues("images") || [];
      const updatedFiles = [...currentFiles, ...newFiles];

      onChange(updatedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number, onChange: (...event: any[]) => void) => {
    const currentFiles = [...form.getValues("images")];
    currentFiles.splice(index, 1);
    onChange(currentFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  async function onSubmit(values: ListingType) {
    try {
      setIsSubmitting(true);
      const listingWithId = { ...values, id: uuidv4() };
      await addListing(listingWithId);
      toast.success("Listing created successfully");
      form.reset();
      setPreviews([]);
      router.push("/marketplace");
    } catch (error) {
      console.error("Failed to create listing", error);
      toast.error("Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl h-[calc(100vh-8rem)] p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            New Marketplace Listing
          </CardTitle>
          <CardDescription className="text-gray-500 font-medium">
            Create a new product or service listing for the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-12 gap-5 "
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-12 ">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter listing title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12 ">
                    <FormLabel>Description * </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product or service in detail"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem className="col-span-12 ">
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Image preview area */}
                        {previews.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {previews.map((preview, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-md overflow-hidden border"
                              >
                                <Image
                                  src={preview || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  fill
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFile(index, field.onChange)
                                  }
                                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload button */}
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="image-upload"
                            className={cn(
                              "flex flex-col items-center justify-center w-full h-32",
                              "border-2 border-dashed rounded-lg cursor-pointer",
                              "hover:bg-muted/50 transition-colors",
                              form.formState.errors.images
                                ? "border-destructive"
                                : "border-muted"
                            )}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="mb-1 text-sm text-muted-foreground">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG, GIF, WEBP (MAX. 5MB)
                              </p>
                            </div>
                            <Input
                              id="image-upload"
                              type="file"
                              accept={ACCEPTED_IMAGE_TYPES.join(",")}
                              className="hidden"
                              onChange={(e) =>
                                handleFileSelect(e, field.onChange)
                              }
                              multiple
                            />
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload one or more images. Each image must be less than
                      5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-12 ">
                    <FormLabel>Listing Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {listingStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-6 ">
                    <FormLabel>Price ($) * </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={0.01}
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-6 ">
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-12 flex justify-between mt-5">
                <Button type="button" variant={"outline"}>
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader />}
                  {isSubmitting ? "Creating..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ListingForm;
