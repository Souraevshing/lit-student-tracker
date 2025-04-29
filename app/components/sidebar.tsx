import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="w-64 border-zinc-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-[1.43rem] border-b border-zinc-800">
        <Link href="/" className="flex items-center">
          <Image src="/brand_logo.svg" alt="LIT Logo" width={20} height={20} />
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 flex flex-col items-center border-b border-zinc-800">
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
        <h2 className="font-medium mt-2">John Doe</h2>
        <p className="text-sm text-zinc-400">LIT School</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Application Documents
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Fee Payment
              <span className="ml-auto bg-blue-500 text-xs rounded-sm w-5 h-5 flex items-center justify-center text-white">
                1
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md bg-zinc-800 text-white"
            >
              <span className="text-yellow-500 mr-1">•</span>
              Account Details
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Personal Documents
              <span className="ml-auto bg-green-500 text-xs rounded-sm w-5 h-5 flex items-center justify-center text-white">
                3
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center w-full px-3 py-2 rounded-md text-red-400 hover:bg-zinc-800">
          <LogOutIcon className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
