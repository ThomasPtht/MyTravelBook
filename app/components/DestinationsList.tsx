"use client"

import { useQuery } from '@tanstack/react-query'
import CityCard, { DestinationType } from './CityCard';




const DestinationsList = () => {

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {data?.map((destination) => (
                <CityCard key={destination.id} destination={destination} />
            ))} :

        </div>
    )
}

export default DestinationsList

