"use client";

import { useAuth } from "@/_context/AuthContext";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();

  const routes = [
    { href: "/shows", label: "Shows", adminOnly: false },
    { href: "/rooms", label: "Rooms", adminOnly: true },
    { href: "/movies", label: "Movies", adminOnly: true },
    { href: "/users", label: "Users", adminOnly: true },
    { href: "/tickets", label: "Tickets", adminOnly: true },
  ];

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

          <ul className="flex gap-5">
            {routes.map(
              (route, index) =>
                (!route.adminOnly || (user && user.role === "admin")) && (
                  <li key={index}>
                    <Link
                      href={route.href}
                      className="font-semibold uppercase hover:text-purple-700"
                    >
                      {route.label}
                    </Link>
                  </li>
                )
            )}
          </ul>

          {user && (
            <div className="flex flex-col items-end">
              <span className="font-bungee text-sm">{user.name}</span>
              <button
                type="button"
                className="flex w-auto cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-sm font-semibold hover:bg-red-500"
                onClick={logout}
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
