"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'


type DestinationType = {
    id: 'number',
    cityName: 'string',
    country: 'string',
    status: 'string',
    description: 'string',
    visitDate: 'string',
    coverImage: 'string',
    neighborhood: 'string',
    budget: 'number',
    food: 'number',
    safety: 'number',
    culture: 'number',
    atmosphere: 'number',
}

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



    return (
        <div>
            {data?.map((destination) => (
                <Card key={destination.id}>
                    <CardHeader>
                        <CardTitle>{destination.cityName}</CardTitle>
                        <CardDescription>{destination.country}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* autres infos */}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default DestinationsList

