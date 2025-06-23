import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="Policy Generator"
              width={180}
              height={48}
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/disclaimer"
              className="text-red-600 hover:text-red-900 transition-colors"
            >
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
