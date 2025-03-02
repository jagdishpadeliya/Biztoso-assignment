"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Loader2 } from "lucide-react";
import { businessProfileSchema } from "@/lib/schema";
import { BusinessProfileType } from "@/lib/types";
import { useProfile } from "@/contexts/profile-context";
import Loader from "@/components/loader";

const ProfileForm = () => {
  const { profile, saveProfile, updateProfile, loading } = useProfile();
  const {
    imagePreview,
    setImagePreview,
    isUploading,
    handleImageChange,
    uploadError,
  } = useImageUpload("");
  const form = useForm<BusinessProfileType>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      logo: "",
      emailAddress: "",
      phoneNumber: "",
      websiteUrl: "",
      industry: "",
      foundedYear: 0,
      noOfEmployees: 0,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
      setImagePreview(profile.logo ?? null);
    }
  }, [profile, form.reset]);

  function onSubmit(values: BusinessProfileType) {
    const profileData = {
      ...values,
      logo: imagePreview || "",
    };
    console.log(profileData);

    if (profile) {
      updateProfile(profileData);
    } else {
      saveProfile(profileData);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="mx-auto max-w-3xl h-[calc(100vh-8rem)]">
      <div className="mt-5 shadow-lg rounded-lg bg-white p-8 ">
        <h1 className="text-2xl font-bold">Create Your Profile</h1>
        <p className="text-gray-500 font-medium">
          Showcase your business with a professional profile
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
            <div className="grid grid-cols-12 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel>Business Name * </FormLabel>
                    <FormControl>
                      <Input placeholder="your Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel>Location * </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City, State/Province, Country"
                        {...field}
                      />
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
                    <FormLabel>Business Description * </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business, products, and services"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-12 flex flex-col items-start sm:flex-row justify-between md:items-center gap-5">
                <div className="flex-1 w-full">
                  {/* <FormField
                    control={form.control}
                    name="logo"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="">
                        <FormLabel>Business Logo * </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              console.log(e.target.files);
                              handleImageChange(e);
                              onChange(e.target.files?.[0] || null);
                            }}
                            {...fieldProps}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended size: 400x400px. Max size: 5MB.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormLabel className="mb-2"> Business Logo * </FormLabel>
                  <Input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <FormDescription>
                    Recommended size: 400x400px. Max size: 5MB.
                  </FormDescription>
                </div>
                <div className="">
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {uploadError && (
                    <span className="text-red-600">{uploadError}</span>
                  )}
                  {imagePreview && (
                    <Image
                      alt="Business Logo"
                      src={imagePreview || "/placeholder.png"}
                      className="object-cover rounded-lg w-24 h-24"
                      width={100}
                      height={100}
                    />
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel>Email Address * </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="contact@yourbusiness.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-6">
                    <FormLabel>Phone Number * </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 123 456 7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="col-span-12 ">
                    <FormLabel>Website </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.yourbusiness.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-4">
                    <FormLabel>Industry </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g Technology, Finance, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="foundedYear"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-4">
                    <FormLabel>Founded Year </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 2010"
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noOfEmployees"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-4">
                    <FormLabel>Numbers of Employee</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 100"
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? Number.parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-start-1 col-span-full flex justify-between mt-5">
                <Button type="button" variant={"outline"}>
                  Reset
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                  Save Profile
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default ProfileForm;
