import React from 'react'
import WorldMap from './components/worldMap'
import { prisma } from '@/lib/prisma';

const MapPage = async () => {
    const destinations = await prisma.city.findMany();

    const visitedCount = destinations
        .filter(dest => dest.status === "visited")
        .map(dest => dest.country)
        .filter((value, index, self) => self.indexOf(value) === index)
        .length;

    const wishlistCount = destinations.filter(dest => dest.status === "wishlist")
        .map(dest => dest.country)
        .filter((value, index, self) => self.indexOf(value) === index)
        .length;

    return (
        <div>
            <div className='flex items-center gap-2 mb-4'>
                <h2 className="text-lg">🌍 My Travel Map</h2>
                <p className="text-muted-foreground mb-8">
                    {visitedCount} {visitedCount > 1 ? "countries" : "country"} visited, {wishlistCount} {wishlistCount > 1 ? "countries" : "country"} on the wishlist
                </p>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
                <div className="w-full max-w-5xl rounded-xl overflow-hidden shadow-lg border bg-card p-4">
                    <WorldMap data={destinations} />
                </div>
            </div>
        </div>
    )
}

export default MapPage