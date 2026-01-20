import ShowCard from "@/(features)/shows/components/ShowCard";
import { IShow } from "@/_models/entities/show.interface";

export function ShowList({ shows }: { shows: IShow[] }) {
  if (shows.length === 0) {
    return (
      <div className="mt-8 py-16 text-center">
        <p className="text-xl text-gray-400">No shows were found.</p>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
      {shows.map((show: IShow) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
