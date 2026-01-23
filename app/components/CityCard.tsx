import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin } from 'lucide-react';
import React from 'react'


export type DestinationType = {
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

const CityCard = ({ destination }: { destination: DestinationType }) => {



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
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{destination.cityName}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin size={16} /> {destination.country}
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">{destination.status}</Badge>
                    </div>
                    {destination.coverImage && (
                        <img src={destination.coverImage} alt={destination.cityName} className="mt-2 rounded-md w-full h-32 object-cover" />
                    )}
                    <span className="text-xs"><Calendar/>Visit date: {destination.visitDate ?? '-'}</span>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <span><strong>Budget:</strong> {destination.budget ?? '-'}</span>
                        <span><strong>Food:</strong> {destination.food ?? '-'}</span>
                        <span><strong>Safety:</strong> {destination.safety ?? '-'}</span>
                        <span><strong>Culture:</strong> {destination.culture ?? '-'}</span>
                        <span><strong>Atmosphere:</strong> {destination.atmosphere ?? '-'}</span>
                    </div>
                    <div className="text-muted-foreground">{destination.description}</div>
                </CardContent>
                <CardFooter>

                    {/* Ajoute ici des boutons ou actions */}
                </CardFooter>
            </Card>

        </div>
    )
}

export default CityCard
