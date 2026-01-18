import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="relative z-10 flex flex-col justify-center max-sm:w-full sm:p-8">
        <h1 className="font-bungee mb-8 text-center text-3xl">
          Movie
          <br />
          Tickets
        </h1>
        {children}
      </div>
      <div className="flex-1 max-sm:absolute max-sm:inset-0 max-sm:flex max-sm:items-end">
        <Image
          src="/auth-bg.jpg"
          alt="Login Illustration"
          width={1920}
          height={1080}
          className="object-contain sm:h-full"
        />
        <div className="absolute bg-linear-to-b from-black to-transparent sm:hidden"></div>
      </div>
    </div>
  );
}
