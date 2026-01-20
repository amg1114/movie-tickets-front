import { IShow } from "@/_models/entities/show.interface";
import { CalendarDaysIcon, ClapperboardIcon, DollarSignIcon } from "lucide-react";
import { ReactNode } from "react";
import { formatTime, formatCurrency } from "@/_utils/dateUtils";

export function ShowDetails({ show }: { show: IShow }) {
  const { room, price } = show;

  return (
    <div className="grid w-full grid-cols-2 gap-y-4">
      <ShowDetail
        label="Start Time"
        description={formatTime(show.startTime)}
        icon={<CalendarDaysIcon className="text-2xl" strokeWidth={2.5} />}
      />
      <ShowDetail
        label="End Time"
        description={formatTime(show.endTime)}
        icon={<CalendarDaysIcon className="text-2xl" strokeWidth={2.5} />}
      />
      <ShowDetail
        label="Room"
        description={room.name}
        icon={<ClapperboardIcon className="text-2xl" strokeWidth={2.5} />}
      />
      <ShowDetail
        label="Price"
        description={formatCurrency(price)}
        icon={<DollarSignIcon className="text-2xl" strokeWidth={2.5} />}
      />
    </div>
  );
}

export function ShowDetail({
  label,
  description,
  icon,
}: {
  label: ReactNode;
  description: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div className="flex flex-col">
        <h4 className="text-2xl leading-none font-semibold">{label}</h4>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
}
