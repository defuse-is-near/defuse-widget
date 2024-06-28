import Link from "next/link"
import Image from "next/image"

import { Navigation } from "@src/constants/routes"

const Logo = () => {
  return (
    <Link href={Navigation.HOME}>
      <Image
        src="/static/icons/Logo_white.svg"
        alt="Defuse Logo"
        width={123}
        height={32}
        className="hidden dark:block"
      />
      <Image
        src="/static/icons/Logo.svg"
        alt="Defuse Logo"
        width={123}
        height={32}
        className="dark:hidden"
      />
    </Link>
  )
}

export default Logo
