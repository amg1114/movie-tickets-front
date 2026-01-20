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
import { AxiosError } from "axios";

export default function UsersPage() {
  const { user: loggedUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get<IUser[]>("/users");
        setUsers(res.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setUsers([]);
        } else {
          console.error("Error fetching users:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading || !loggedUser) {
    return <LoadingSpinner />;
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<IUser[]>("/users");
      setUsers(res.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setUsers([]);
      } else {
        console.error("Error fetching users:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisableUser = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/disable`);
      fetchUsers();
    } catch (error) {
      console.error("Error disabling user:", error);
    }
  };

  const handleEnableUser = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/enable`);
      fetchUsers();
    } catch (error) {
      console.error("Error enabling user:", error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bungee text-2xl">Users Management</h1>
      </div>

      <StyledTable>
        <TableHeader>
          <TableRow>
            <TableHeadCell> </TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Role</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(
            (user) =>
              user.id !== loggedUser.id && (
                <TableRow key={user.id}>
                  <TableCell className="w-6 text-center">
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${user.disabled ? "bg-red-500" : "bg-green-500"}`}
                    ></span>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!user.disabled && (
                        <ActionButton variant="danger" onClick={() => handleDisableUser(user.id)}>
                          Disable
                        </ActionButton>
                      )}
                      {user.disabled && (
                        <ActionButton variant="success" onClick={() => handleEnableUser(user.id)}>
                          Enable
                        </ActionButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </StyledTable>
    </div>
  );
}
