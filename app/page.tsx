import Link from "next/link";

export default function RootPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Selamat Datang</h1>
      <Link 
        href="/dashboard" 
        className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
      >
        Buka Admin Panel
      </Link>
    </div>
  );
}