"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h1 className='text-5xl font-light'>My Travel Book</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => signOut()}>Se déconnecter</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='flex items-center justify-between mt-2'>
                <p className="text-xl text-muted-foreground">Explore, rate and remember your favorite cities</p>


                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger> <Button><Plus />Add destination</Button></DialogTrigger>
                    <DialogContent className="!w-fit !max-w-[90vw]" >
                        <FormAddDestination onClose={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>


            </div>
        </div>
    )
}

export default Header
