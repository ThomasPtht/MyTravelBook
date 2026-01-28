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
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-muted/40 rounded-lg p-8">
                <img
                    src="/empty-data.png"
                    alt="No destination to display"
                    className="w-40 h-40 object-contain mb-4 opacity-80 "
                />
                <div className="text-lg font-semibold text-muted-foreground mb-2">Aucune destination à afficher</div>
                <div className="text-sm text-muted-foreground">Ajoutez une destination pour commencer votre carnet de voyage !</div>
            </div>
        );
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

