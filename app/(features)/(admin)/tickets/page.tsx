"use client";

import {
  StyledTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@/_ui/components/table";
import { ActionButton } from "@/_ui/components/table/ActionButton";
import { useEffect, useState } from "react";
import { api } from "@/_lib/axios";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { IUser } from "@/_models/entities/user.interface";
import { useAuth } from "@/_context/AuthContext";
import { ITicket } from "@/_models/entities/ticket.interface";
import Link from "next/link";
import { GlobeIcon } from "lucide-react";

export default function TicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<ITicket[]>("/tickets");
        setTickets(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get<ITicket[]>("/tickets");
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bungee text-2xl">Tickets History</h1>
      </div>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeadCell>Show</TableHeadCell>
            <TableHeadCell>User</TableHeadCell>
            <TableHeadCell>Quantity</TableHeadCell>
            <TableHeadCell>Total</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="w-6 text-center">
                <Link href={`/shows/${ticket.show.id}`}>
                  <GlobeIcon className="mx-auto text-2xl" strokeWidth={2.5} />
                </Link>
              </TableCell>
              <TableCell>
                {ticket.user.name} <br />
                <a href={`mailto:${ticket.user.email}`} className="underline hover:font-semibold">
                  {ticket.user.email}
                </a>
              </TableCell>

              <TableCell>{ticket.quantity}</TableCell>
              <TableCell>
                $
                {ticket.total_amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </div>
  );
}
