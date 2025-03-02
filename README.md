# Biztoso Project

## Overview

This project is a marketplace application where users can create and manage listings for products and services. The application includes features for creating business profiles, messaging, lead generation, and more.

## Changes and Additions

### 1. Listing Form Component

- **File:** `/src/app/marketplace/new/_components/listing-form.tsx`
- **Description:**
  - Created a form component for creating new marketplace listings.
  - Integrated `react-hook-form` with `zod` for form validation.
  - Added image upload functionality with preview and removal options.
  - Included fields for title, description, price, category, status, and images.
  - Ensured the form resets after submission.

### 2. Listing Schema

- **File:** `/src/lib/schema.ts`
- **Description:**
  - Defined a `listingSchema` using `zod` for validating listing data.
  - Included fields for title, description, price, category, status, images, createdAt, updatedAt, ownerId, and id.
  - Added validation for image file types and sizes.

### 3. Listing Context

- **File:** `/src/contexts/listing-context.tsx`
- **Description:**
  - Created a context for managing marketplace listings.
  - Implemented functions to add, delete, update, and fetch listings.
  - Integrated IndexedDB for storing and retrieving images associated with listings.
  - Ensured listings are fetched with images and converted date strings to Date objects.

### 4. Home Page

- **File:** `/src/app/page.tsx`
- **Description:**
  - Created a home page with tiles linking to different sections of the application.
  - Included sections for Business Profile, Messaging, Marketplace, and Lead Generation.
  - Each tile includes a title, short description, long description, and a button linking to the respective section.

## How to Use

1. **Run the Application:**

   - Ensure you have all dependencies installed.
   - Start the development server using `npm run dev` or `yarn dev`.

2. **Create a Listing:**

   - Navigate to the marketplace section and create a new listing using the form.
   - Fill in the required fields and upload images.
   - Submit the form to add the listing to the marketplace.

3. **Manage Listings:**
   - Use the context functions to add, delete, update, and fetch listings.
   - Images are stored in IndexedDB and associated with listings.

## Dependencies

- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `next`
- `lucide-react`
- `uuid`
