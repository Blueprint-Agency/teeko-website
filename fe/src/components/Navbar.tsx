import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";
import { User, Search } from "lucide-react"; // Start by using lucide-react (standard in shadcn/next)

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto flex h-[72px] items-center justify-between px-4 lg:px-8">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                        <Image
                            src="/teeko-icon.png"
                            alt="Teeko"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">Teeko</span>
                </Link>

                {/* Center: Menu Links (Desktop) */}
                <div className="hidden md:flex items-center gap-1 rounded-full bg-gray-50 p-1 border border-gray-100">
                    <Link href="/locations" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all">
                        Destinations
                    </Link>
                    <Link href="/restaurants" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all">
                        Restaurants
                    </Link>
                </div>

                {/* Right: Auth/Profile */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="md:hidden rounded-full">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Link href="/auth/login">
                        <Button variant="primary" size="sm" className="gap-2 shadow-none hover:shadow-md">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign In</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
