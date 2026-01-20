"use client";

import { ShowList } from "@/(features)/shows/components/ShowList";
import { api } from "@/_lib/axios";
import { IRoom } from "@/_models/entities/room.interface";
import { IShow } from "@/_models/entities/show.interface";
import StyledDatePicker from "@/_ui/components/forms/StyledDatePicker";
import StyledInput from "@/_ui/components/forms/StyledInput";
import StyledSelect from "@/_ui/components/forms/StyledSelect";
import { LoadingSpinner } from "@/_ui/components/partials/LoadingSpinner";
import { AxiosError } from "axios";
import { BrushCleaningIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ShowFilters {
  title: string;
  date: string;
  room: string;
}

export default function ShowsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [shows, setShows] = useState<IShow[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ShowFilters>({
    title: searchParams.get("title") || "",
    date: searchParams.get("date") || "",
    room: searchParams.get("room") || "",
  });

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.title) params.set("title", filters.title);
    if (filters.date) params.set("date", filters.date);
    if (filters.room) params.set("room", filters.room);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/shows";

    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Fetch shows with filters
  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.title) params.set("title", filters.title);
        if (filters.date) params.set("date", filters.date);
        if (filters.room) params.set("room", filters.room);

        const response = await api.get<IShow[]>(`/shows/available?${params.toString()}`);
        setShows(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setShows([]);
        } else {
          console.error("Error fetching shows:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const timeoutId = setTimeout(() => {
      fetchShows();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get<IRoom[]>("/rooms");
        setRooms(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setRooms([]);
        } else {
          console.error("Error fetching rooms:", error);
        }
      }
    };

    fetchRooms();
  }, []);

  const handleFilterChange = (key: keyof ShowFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const showClear = Boolean(filters.title || filters.date || filters.room);

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <StyledInput
            label="Title"
            placeholder="Search a Movie"
            value={filters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
          />
        </div>
        <div className="grid shrink-0 gap-4 max-sm:w-full md:min-w-sm md:grid-cols-2">
          <StyledDatePicker
            label="Select a Date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
          <StyledSelect
            label="Select a Room"
            options={[
              { value: "", label: "All Rooms" },
              ...rooms.map((room) => ({ value: room.name, label: room.name })),
            ]}
            value={filters.room}
            onChange={(e) => handleFilterChange("room", e.target.value)}
          />
        </div>
        {showClear && (
          <div className="flex w-full justify-end">
            <button
              className="flex cursor-pointer items-center gap-1.5 rounded bg-blue-600 px-6 py-2 font-bold text-white hover:bg-red-700"
              onClick={() => {
                setFilters({ title: "", date: "", room: "" });
              }}
            >
              <BrushCleaningIcon /> Clear
            </button>
          </div>
        )}
      </div>

      {loading ? <LoadingSpinner /> : <ShowList shows={shows} />}
    </div>
  );
}
