import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-12 px-4 bg-black border-t border-white/10">
            <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                    <img
                        src="/manteia-1-logo.svg"
                        alt="Manteia Protocol"
                        className="h-8 w-auto" // Adjust height as needed based on the SVG aspect ratio
                    />
                </Link>

                {/* Copyright */}
                <div className="flex items-center gap-8">
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
                        © {new Date().getFullYear()} MANTEIA PROTOCOL
                    </p>
                </div>

            </div>
        </footer>
    );
}
