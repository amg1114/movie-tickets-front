export default function ShowDay({ startTime }: { startTime: Date }) {
  const shortMonth = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(startTime);

  const day = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
  }).format(startTime);

  const shortWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(startTime);

  return (
    <div className="flex w-full items-center justify-center gap-2 rounded bg-purple-500 p-2 px-2 text-center font-medium uppercase md:aspect-square md:w-20 md:flex-col">
      <span className="max-sm:hidden">{shortMonth}</span>
      <span className="text-5xl font-bold max-sm:leading-none md:text-3xl">{day}</span>
      <span className="max-sm:hidden">{shortWeekday}</span>
      <span className="flex flex-col gap-0.5 text-start text-xl leading-none md:hidden">
        <span>{shortMonth}</span>
        <span>{shortWeekday}</span>
      </span>
    </div>
  );
}
