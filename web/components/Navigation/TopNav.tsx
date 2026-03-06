"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface TopNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/measure", label: "Data Collection" },
  { href: "/manage", label: "Calculations" },
  { href: "/act", label: "Act" },
  { href: "/report", label: "Report" },
  { href: "/admin", label: "Admin" },
];

export default function TopNav({ user }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="top-nav">
      <div className="top-nav__container">
        {/* Logo and Brand */}
        <div className="top-nav__brand">
          <Link href="/dashboard" className="top-nav__brand-link">
            <Image
              src="/logo.png"
              alt="OpenEco"
              width={24}
              height={24}
              className="top-nav__logo"
            />
            <span className="top-nav__brand-text">OpenEco</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="top-nav__main">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`top-nav__link ${isActive ? "top-nav__link--active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="top-nav__actions">
          {/* Search Icon */}
          <button
            className="top-nav__icon-btn"
            aria-label="Search"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM18 18l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Notifications Icon */}
          <button
            className="top-nav__icon-btn"
            aria-label="Notifications"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 13H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 13v1a3 3 0 0 0 6 0v-1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* User Avatar */}
          <div className="top-nav__user">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="top-nav__avatar"
              />
            ) : (
              <div className="top-nav__avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
