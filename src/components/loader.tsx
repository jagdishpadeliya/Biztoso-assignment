import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Loader;
