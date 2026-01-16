import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <div>
            <h1 className='text-5xl font-light'>My Travel Book</h1>
            <div className='flex items-center justify-between mt-2'>
                <p className="text-xl text-muted-foreground">Explore, rate and remember your favorite cities</p>
                <Button><Plus />Add destination</Button>
            </div>
        </div>
    )
}

export default Header
