export function MovieDetails({ details }: { details: { label: string; icon: React.ReactNode }[] }) {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {details.map((detail, index) => (
        <li
          key={index}
          className="flex flex-col items-center gap-2 border-white/30 font-semibold text-white md:text-lg"
        >
          {detail.icon}
          <span>{detail.label}</span>
        </li>
      ))}
    </ul>
  );
}
