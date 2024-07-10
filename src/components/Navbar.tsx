"use client"

import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { Button } from "@radix-ui/themes"

import { LINKS_HEADER, NavigationLinks } from "@src/constants/routes"
import LabelComingSoon from "@src/components/LabelComingSoon"

const TURN_OFF_APPS = process?.env?.turnOffApps === "true" ?? true

type Props = {
  links?: NavigationLinks[]
}

const Navbar = ({ links = LINKS_HEADER }: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <nav className="flex justify-between items-center gap-4">
      {links!.map((route, i) => {
        const isCurrentPage = route.href === pathname
        if (route.action) {
          return (
            <button
              key={i}
              className="text-sm"
              onClick={route.action}
              disabled={TURN_OFF_APPS || route.comingSoon}
            >
              {route.label}
            </button>
          )
        }
        return (
          <Button
            radius="full"
            color="gray"
            highContrast
            variant={isCurrentPage ? "classic" : "soft"}
            className={clsx(
              "relative text-sm",
              TURN_OFF_APPS || route.comingSoon
                ? "pointer-events-none text-gray-500"
                : "cursor-pointer",
              isCurrentPage
                ? "text-white dark:text-black-400"
                : "bg-transparent"
            )}
            key={i}
            onClick={() => router.push(route.href ?? "")}
          >
            {route.label}
            {route.comingSoon && !isCurrentPage && <LabelComingSoon />}
          </Button>
        )
      })}
    </nav>
  )
}

export default Navbar
