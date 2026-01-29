"use client"

import { useQuery } from '@tanstack/react-query'
import CityCard, { DestinationType } from './CityCard';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import DetailsCityCard from './DetailsCityCard';
import { useState } from 'react';
import { ClipLoader, PropagateLoader } from "react-spinners";



const DestinationsList = ({
    status,
    data,
    isLoading,
    error,
}: {
    status: "all" | "visited" | "wishlist";
    data: DestinationType[] | undefined;
    isLoading: boolean;
    error: any;
}) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (!open) setSelectedId(null);
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="relative w-[80px] h-[80px] flex items-center justify-center">
                    <ClipLoader
                        color="#6b7280" // gris neutre Tailwind gray-500
                        size={80}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                    />
                    <img
                        src="/airplane.svg"
                        alt="Chargement..."
                        className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-10 animate-spin-slow filter invert-47 sepia-99 saturate-747 hue-rotate-167 brightness-95 contrast-92"
                        style={{ animationDuration: '2.5s' }}
                    />
                </div>
            </div>
        );
    }

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
                    <DialogTitle className="sr-only">Destination details</DialogTitle>

                    {typeof selectedId === "number" && (
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

