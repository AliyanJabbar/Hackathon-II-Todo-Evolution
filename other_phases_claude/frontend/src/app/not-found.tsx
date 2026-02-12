import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="TaskGenie Lamp"
          width={200}
          height={150}
          className="mx-auto mb-8 h-20 w-auto md:h-24"
        />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent">
          Genie Not Found
        </h1>
        <p className="text-slate-400">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
