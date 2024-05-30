"use client"

import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"

import { LINKS_HEADER } from "@/constants/routes"

const Navbar = () => {
  const pathname = usePathname()
  return (
    <nav className="flex justify-between items-center gap-4">
      {LINKS_HEADER.map((route, i) => {
        const isCurrentPage = route.href === pathname
        return (
          <Link
            href={route.href}
            key={i}
            className={clsx(
              "px-3 py-1.5 rounded-full text-sm",
              isCurrentPage && "bg-black-400 text-white"
            )}
          >
            {route.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default Navbar
