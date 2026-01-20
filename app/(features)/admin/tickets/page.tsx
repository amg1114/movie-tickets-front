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
import { ITicket } from "@/_models/entities/ticket.interface";
import Link from "next/link";
import { GlobeIcon } from "lucide-react";
import clsx from "clsx";
import { formatCurrency } from "@/_utils/dateUtils";
import { AxiosError } from "axios";

export default function TicketsPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<ITicket[]>("/tickets");
        setTickets(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setTickets([]);
        } else {
          console.error("Error fetching tickets:", error);
        }
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
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setTickets([]);
      } else {
        console.error("Error fetching tickets:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTicket = async (ticketId: string) => {
    try {
      await api.patch(`/tickets/${ticketId}`, { status: "CONFIRMED" });
      fetchTickets();
    } catch (error) {
      console.error("Error canceling ticket:", error);
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    try {
      await api.patch(`/tickets/${ticketId}`, { status: "CANCELLED" });
      fetchTickets();
    } catch (error) {
      console.error("Error canceling ticket:", error);
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
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>User</TableHeadCell>
            <TableHeadCell>Quantity</TableHeadCell>
            <TableHeadCell>Total</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-gray-400">
                No tickets were found.
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="w-6 text-center">
                  <Link href={`/shows/${ticket.show.id}`}>
                    <GlobeIcon className="mx-auto text-2xl" strokeWidth={2.5} />
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={clsx(`rounded-full} inline-block h-3 w-3 rounded-full`, {
                      "bg-green-500": ticket.status === "CONFIRMED",
                      "bg-yellow-500": ticket.status === "PENDING",
                      "bg-red-500": ticket.status === "CANCELLED",
                    })}
                  ></span>
                  <span className="ml-2 capitalize">{ticket.status}</span>
                </TableCell>
                <TableCell>
                  {ticket.user.name} <br />
                  <a href={`mailto:${ticket.user.email}`} className="underline hover:font-semibold">
                    {ticket.user.email}
                  </a>
                </TableCell>

                <TableCell>{ticket.quantity}</TableCell>
                <TableCell>{formatCurrency(ticket.total_amount)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {ticket.status === "PENDING" && (
                      <ActionButton
                        variant="success"
                        onClick={() => handleCompleteTicket(ticket.id)}
                      >
                        Complete
                      </ActionButton>
                    )}
                    {ticket.status === "PENDING" && (
                      <ActionButton variant="danger" onClick={() => handleCancelTicket(ticket.id)}>
                        Cancel
                      </ActionButton>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </div>
  );
}
