"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut, useSession } from "next-auth/react";

const Header = () => {
    const [open, setOpen] = useState(false);

    const { data: session } = useSession();
    // @ts-expect-error: username is added via NextAuth callback
    const username = session?.user?.username;

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h1 className='text-5xl font-light'>My Travel Book</h1>
                <div className="flex items-center gap-4">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger> <Button><Plus />Add destination</Button></DialogTrigger>
                        <DialogContent className="w-fit! max-w-[90vw]!" >
                            <FormAddDestination onClose={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className='cursor pointer' size="lg">
                                <AvatarImage src="/public/avatar.png" />
                                <AvatarFallback>
                                    {(session?.user as { username?: string })?.username?.[0]?.toUpperCase() ?? "U"}
                                </AvatarFallback>
                                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-56'>
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
