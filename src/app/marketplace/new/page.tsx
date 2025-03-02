import ListingForm from "./_components/create-listing";

const page = () => {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Create New Listing</h1>
      <ListingForm />
    </main>
  );
};

export default page;
