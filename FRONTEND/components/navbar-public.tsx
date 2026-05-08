import Link from "next/link";

export default function Header({ serverIsLoggedIn }: { serverIsLoggedIn?: boolean }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">T</div>
          <span className="font-black text-xl tracking-tighter text-slate-900">TEFA <span className="text-red-600">MOKLET</span></span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <Link href="/#about" className="hover:text-slate-900 transition-colors">About</Link>
          <Link href="/#majors" className="hover:text-slate-900 transition-colors">Majors</Link>
          <Link href="/catalog" className="text-red-600">Catalog</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {serverIsLoggedIn ? (
            <Link
              href="/customer"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-all active:scale-95 shadow-md shadow-red-100"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-slate-600 hover:text-red-600 font-bold text-sm transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold transition-all active:scale-95 shadow-md shadow-red-100"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}