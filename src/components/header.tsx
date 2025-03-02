import React from "react";
import {
  Building2,
  List,
  MessageSquare,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const navItems = [
  { name: "Dashboard", href: "/", icon: null },
  { name: "Profile", href: "/profile", icon: Building2 },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Leads", href: "/leads", icons: Users },
];

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div>
        <span className="font-extrabold text-2xl">Biztoso</span>
      </div>
      <div className="hidden md:block">
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:hidden">
        <Button className="cursor-pointer" variant={"ghost"}>
          <List size={16} />
        </Button>
        {/* //Todo: Add mobile menu */}
      </div>
    </div>
  );
};

export default Header;
