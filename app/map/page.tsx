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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
            <h1 className="text-4xl font-bold mb-2">🌍 My Travel Map</h1>
            <p className="text-muted-foreground mb-8">
                {visitedCount} {visitedCount > 1 ? "countries" : "country"} visited
            </p>
            <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg border bg-card p-4">
                <WorldMap data={destinations} />
            </div>
        </div>
    )
}

export default MapPage