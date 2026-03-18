import Link from "next/link"
import { glide } from "@/lib/glidepath"
import { AdminNav } from "./admin-nav"
import { User } from "./user"

export async function Header() {
  return (
    <HeaderBar>
      <Nav>
        <NavLeft>
          <Brand href="/">Kiwiburn</Brand>
          <AdminNav />
        </NavLeft>
        <NavRight>
          <User />
        </NavRight>
      </Nav>
    </HeaderBar>
  )
}

const Brand = glide(Link, {
  borderRadius: "rounded-sm",
  fontSize: "text-lg",
  fontWeight: "font-bold",
  outlineStyle: "focus-visible:outline-none",
  ringColor: "focus-visible:ring-white/70",
  ringWidth: "focus-visible:ring-2",
})

const HeaderBar = glide("header", {
  backgroundColor: "bg-[#332d2d]",
  color: "text-white",
})

const Nav = glide("nav", {
  alignItems: "items-center",
  display: "flex",
  height: "h-14",
  justifyContent: "justify-between",
  marginX: "mx-auto",
  maxWidth: "max-w-4xl",
  other: "container",
  paddingX: "px-4",
})

const NavLeft = glide("div", {
  alignItems: "items-center",
  display: "flex",
  gap: ["gap-3", "sm:gap-6"],
})

const NavRight = glide("div", {
  alignItems: "items-center",
  display: "flex",
  gap: ["gap-2", "sm:gap-4"],
})
