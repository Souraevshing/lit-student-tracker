"use client";

import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="w-64 border-r border-border flex flex-col h-screen bg-background">
      {/* Logo */}
      <div className="p-[1.43rem] border-b border-border">
        <Link href="/" className="flex items-center">
          <Image src="/brand_logo.svg" alt="LIT Logo" width={20} height={20} />
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 flex flex-col items-center border-b border-border">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Avatar className="w-full h-full">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="John Doe"
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="w-full h-full">JD</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="font-medium mt-2 text-foreground">John Doe</h2>
        <p className="text-sm text-muted-foreground">LIT School</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Application Documents
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Fee Payment
              <span className="ml-auto bg-primary text-xs rounded-sm w-5 h-5 flex items-center justify-center text-primary-foreground">
                1
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md bg-muted text-foreground"
            >
              <span className="text-yellow-500 mr-1">•</span>
              Account Details
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Personal Documents
              <span className="ml-auto bg-green-500 text-xs rounded-sm w-5 h-5 flex items-center justify-center text-primary-foreground">
                3
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => {
            toast.error("Logged out");
            signOut({ redirectTo: "/" });
          }}
          className="flex items-center w-full justify-start text-destructive hover:bg-muted hover:text-destructive"
        >
          <LogOutIcon className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
