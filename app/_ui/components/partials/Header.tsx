"use client";

import { useAuth } from "@/_context/AuthContext";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user } = useAuth();
  return (
    <header>
      <div className="container">
        <nav className="flex items-center justify-between">
          <div className="p-2">
            <Link
              href="/shows"
              className="font-bungee flex aspect-square w-14 items-center justify-center rounded-md border border-white text-2xl hover:bg-purple-700"
            >
              MT
            </Link>
          </div>
          {user && (
            <div className="flex flex-col items-end">
              <span className="font-bungee text-sm">{user.name}</span>
              <button
                type="button"
                className="flex w-auto cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm font-semibold hover:bg-red-500"
              >
                <LogOutIcon /> Log Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
