"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BookOpen, Globe, Plus } from 'lucide-react'

import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const activePage = pathname === "/map" ? "map" : "journal";

    const { data: session } = useSession();
    // @ts-expect-error: username is added via NextAuth callback
    const username = session?.user?.username;

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className="flex items-center gap-6">
                    <h1 onClick={() => router.push("/")} className="font-sans text-4xl font-light tracking-tight text-foreground text-balance cursor-pointer">
                        My Travel Book
                    </h1>

                    {/* Navigation */}
                    <nav className="inline-flex items-center rounded-lg border bg-muted p-1 gap-0.5">
                        <button
                            onClick={() => router.push("/")}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${activePage === "journal"
                                ? "bg-background text-foreground shadow-sm border"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <BookOpen className="h-4 w-4" />
                            Journal
                        </button>
                        <button
                            onClick={() => router.push("/map")}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${activePage === "map"
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
                        <DialogContent className="w-fit! max-w-[90vw]!" >
                            <FormAddDestination onClose={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar data-testid="avatar-trigger" className='cursor pointer' size="lg">
                                <AvatarImage src="/public/avatar.png" />
                                <AvatarFallback>
                                    {(session?.user as { username?: string })?.username?.[0]?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-56' data-testid="dropdown-menu-content">
                            <DropdownMenuLabel>  {(session?.user as { username?: string })?.username ?? "U"}</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>Se déconnecter</DropdownMenuItem>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>

            <div className='flex items-center justify-between mt-2 gap-4'>
                <div className="grow">
                    <p className="text-xl text-muted-foreground">Explore, rate and remember your favorite cities</p>
                </div>

            </div>
        </div>
    )
}

export default Header
