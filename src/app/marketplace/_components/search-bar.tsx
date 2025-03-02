import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  placeholder: string;
};

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}: SearchBarProps) => {
  return (
    <div className="relative flex items-center">
      <Search className="text-gray-500 absolute ml-2" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border-2 text-2xl border-gray-200 rounded-lg px-10 py-6 placeholder:text-lg ring-offset-blue-600 focus:ring-2 focus-visible:ring-blue-600 active:ring-blue-600"
      />
    </div>
  );
};

export default SearchBar;
