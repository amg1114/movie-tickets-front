import { Header } from "@/_ui/components/partials/Header";

export default function ShowsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gap-8 py-6">
      <Header />
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
