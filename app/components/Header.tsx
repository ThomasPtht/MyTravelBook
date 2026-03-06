"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Globe, LayoutGrid, Plus } from 'lucide-react'
import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

const Header = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const activePage = pathname === "/map" ? "map" : "journal"
  const { data: session } = useSession()
  const username = (session?.user as { username?: string })?.username

  return (
    <header >
      <div className="mx-auto flex m items-center justify-between px-4 ">
        {/* Left: Logo + Title + Tabs */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/travel-book-logo.png"
              alt="My Travel Book"
              width={120}
              height={120}
              className="h-10 w-10 sm:h-18 sm:w-18 object-contain"
            />
            <h1 className="text-lg sm:text-2xl font-serif text-foreground">
              My Travel Book
            </h1>
          </div>

          {/* Tab switcher — desktop */}
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-border bg-secondary p-1 ml-4">
            <button
              onClick={() => router.push("/")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activePage === "journal"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid size={15} />
              Journal
            </button>
            <button
              onClick={() => router.push("/map")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activePage === "map"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe size={15} />
              Map
            </button>
          </div>
        </div>

        {/* Right: Add + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4"
                size="sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add destination</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <FormAddDestination onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold cursor-pointer">
                {username?.[0]?.toUpperCase() ?? "U"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{username ?? "User"}</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Subtitle + mobile tabs */}
      <div className="mx-auto  px-4 sm:px-6 pb-3 sm:pb-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-0">
          Explore, rate and remember your favorite cities
        </p>
        {/* Mobile tab switcher */}
        <div className="flex sm:hidden items-center gap-1 rounded-full border border-border bg-secondary p-1 mt-2 w-fit">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activePage === "journal"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <LayoutGrid size={13} />
            Journal
          </button>
          <button
            onClick={() => router.push("/map")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activePage === "map"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            <Globe size={13} />
            Map
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
