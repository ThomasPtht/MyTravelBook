"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

import { FormAddDestination } from './FormAddDestination'
import { useState } from 'react'

const Header = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <h1 className='text-5xl font-light'>My Travel Book</h1>
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
