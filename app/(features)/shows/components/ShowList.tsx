import ShowCard from "@/(features)/shows/components/ShowCard";
import { IShow } from "@/_models/entities/show.interface";

export function ShowList({ shows }: { shows: IShow[] }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {shows.map((show: IShow) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
