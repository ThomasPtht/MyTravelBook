"use client"

import { useQuery } from '@tanstack/react-query'
import CityCard, { DestinationType } from './CityCard';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DetailsCityCard from './DetailsCityCard';
import { useState } from 'react';



const DestinationsList = ({ status }: { status: "all" | "visited" | "wishlist" }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (!open) setSelectedId(null);
    };


    async function fetchDestinations() {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        return res.json();
    }

    const { data, isLoading, error } = useQuery<DestinationType[]>({
        queryKey: ['destinations'],
        queryFn: fetchDestinations,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading destinations</div>;

    if (!data || data.length === 0) {
        return <div>No destination to display</div>
    }

    const filtered = status === "all"
        ? data
        : data.filter(d => d.status === status);


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered?.map((destination) => (
                    <div
                        key={destination.id}
                        onClick={() => setSelectedId(destination.id)}
                        className="cursor-pointer"
                    >
                        <CityCard destination={destination} />
                    </div>
                ))}
            </div>

            <Dialog open={!!selectedId} onOpenChange={handleOpenChange}>
                <DialogContent className="w-fit! max-w-[90vw]!">
                    {selectedId && (
                        <DetailsCityCard
                            onClose={() => setSelectedId(null)}
                            id={selectedId}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default DestinationsList

