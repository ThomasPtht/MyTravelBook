"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { BookOpen, Globe, Plus } from 'lucide-react'
import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const activePage = pathname === "/map" ? "map" : "journal"
  const { data: session } = useSession()
  const username = (session?.user as { username?: string })?.username

  return (
    <div className="w-full">

      {/* ── DESKTOP (md+) : layout original en une ligne ── */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1
            onClick={() => router.push("/")}
            className="font-sans text-4xl font-light tracking-tight text-foreground cursor-pointer"
          >
            My Travel Book
          </h1>
          <nav className="inline-flex items-center rounded-lg border bg-muted p-1 gap-0.5">
            <button
              onClick={() => router.push("/")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                activePage === "journal"
                  ? "bg-background text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Journal
            </button>
            <button
              onClick={() => router.push("/map")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                activePage === "map"
                  ? "bg-background text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
              Map
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus />Add destination</Button>
            </DialogTrigger>
            <DialogContent className="w-fit! max-w-[90vw]!">
              <FormAddDestination onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar data-testid="avatar-trigger" className="cursor-pointer" size="lg">
                <AvatarImage src="/public/avatar.png" />
                <AvatarFallback>{username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{username ?? "U"}</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sous-titre desktop */}
      <div className="hidden md:block mt-2">
        <p className="text-xl text-muted-foreground">
          Explore, rate and remember your favorite cities
        </p>
      </div>

      {/* ── MOBILE (< md) : 2 lignes ── */}
      <div className="flex md:hidden flex-col gap-3">

        {/* Ligne 1 : Titre + Avatar */}
        <div className="flex items-center justify-between">
          <h1
            onClick={() => router.push("/")}
            className="font-sans text-2xl font-light tracking-tight text-foreground cursor-pointer"
          >
            My Travel Book
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar data-testid="avatar-trigger" className="cursor-pointer" size="lg">
                <AvatarImage src="/public/avatar.png" />
                <AvatarFallback>{username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{username ?? "U"}</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Ligne 2 : Nav + Bouton + */}
        <div className="flex items-center justify-between">
          <nav className="inline-flex items-center rounded-lg border bg-muted p-1 gap-0.5">
            <button
              onClick={() => router.push("/")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                activePage === "journal"
                  ? "bg-background text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Journal
            </button>
            <button
              onClick={() => router.push("/map")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                activePage === "map"
                  ? "bg-background text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
              Map
            </button>
          </nav>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit! max-w-[90vw]!">
              <FormAddDestination onClose={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </div>
  )
}

export default Header