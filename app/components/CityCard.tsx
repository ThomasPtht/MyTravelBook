import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, MapPin, Palette, ShieldCheck, Sparkles, Star, Utensils, X } from 'lucide-react';
import { useTransition } from 'react';

// Import de l'action de suppression côté client
import { deleteDestination } from "../actions/destination";


export type DestinationType = {
    id: number,
    cityName: string,
    country: string,
    status: string,
    description: string,
    visitDate: string,
    coverImage: string,
    neighborhood: string[],
    overallRating: number,
    budget: number,
    food: number,
    safety: number,
    culture: number,
    atmosphere: number,
}


import React, { useState } from 'react';

const CityCard = ({ destination }: { destination: DestinationType }) => {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    // Ouvre la dialog de confirmation
    const handleOpenDialog = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(true);
    };

    // Confirme la suppression
    const handleConfirmDelete = async () => {
        setOpen(false);
        startTransition(async () => {
            await deleteDestination(destination.id);

        });
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

    return (
        <div>
            <Card className="group overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between"></div>
                {destination.coverImage && (
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        {/* Bouton croix suppression */}
                        <button
                            onClick={handleOpenDialog}
                            className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
                            title="Supprimer cette destination"
                        >
                            <X size={18} />
                        </button>
                        {/* Dialog de confirmation */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Supprimer la destination ?</DialogTitle>
                                </DialogHeader>
                                <p>Cette action est irréversible. Voulez-vous vraiment supprimer <b>{destination.cityName}</b> ?</p>
                                <DialogFooter>
                                    <button
                                        className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 cursor-pointer mr-2"
                                        onClick={() => setOpen(false)}
                                        disabled={isPending}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded bg-destructive text-white hover:bg-destructive/80 cursor-pointer"
                                        onClick={handleConfirmDelete}
                                        disabled={isPending}
                                    >
                                        Supprimer
                                    </button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <img
                            src={destination.coverImage}
                            alt={destination.cityName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-md" />
                        {/* Badge en haut à droite */}
                        <div className="absolute top-2 right-2 z-10">
                            <Badge className='rounded-md capitalize' variant="orange">{destination.status}</Badge>
                        </div>
                        {/* Infos en bas à gauche */}
                        <div className="absolute bottom-2 left-2 text-white z-10 m-2">
                            <div className="font-light text-2xl text-balance">{destination.cityName}</div>
                            <div className="flex gap-1 justify-center text-sm mt-2 text-white/90 font-light">
                                <MapPin size={18} />
                                {destination.country}
                            </div>

                        </div>
                    </div>
                )}
                {destination.status === "visited" && (
                    <CardContent>
                        <div className="flex flex-col gap-3 mb-4">
                            {destination.visitDate && (
                                <div className=" flex text-muted-foreground items-center gap-1 mt-1">
                                    <Calendar size={18} />
                                    {destination.visitDate}
                                </div>
                            )}
                            {/* Overall Rating */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={19}
                                        className={`inline-block ${i < (destination.overallRating ?? 0) ? "fill-yellow-600 text-yellow-600" : "text-slate-200"}`}
                                    />
                                ))}
                                <span className="text-muted-foreground text-sm ">{destination.overallRating}/5</span>
                            </div>

                            <div className="text-xs flex items-center gap-1">

                            </div>
                            <div className="flex w-full justify-between text-xs">
                                <span className="flex flex-col items-center"><DollarSign className='text-muted-foreground' size={18} />
                                    <div>
                                        {Array.from({ length: destination.budget ?? 0 }).map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-foreground inline-block mx-0.5"></div>
                                        ))}
                                    </div>
                                </span>
                                <span className="flex flex-col items-center"><Utensils className='text-muted-foreground' size={18} />
                                    <div> {Array.from({ length: destination.food ?? 0 }).map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-foreground inline-block mx-0.5"></div>
                                    ))}</div></span>
                                <span className='flex flex-col items-center'><ShieldCheck className='text-muted-foreground' size={18} />
                                    <div>{Array.from({ length: destination.safety ?? 0 }).map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-foreground inline-block mx-0.5"></div>
                                    ))}</div></span>
                                <span className='flex flex-col items-center'><Palette className='text-muted-foreground' size={18} />
                                    <div>{Array.from({ length: destination.culture ?? 0 }).map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-foreground inline-block mx-0.5"></div>
                                    ))}</div></span>
                                <span className='flex flex-col items-center'><Sparkles className='text-muted-foreground' size={18} />
                                    <div>{Array.from({ length: destination.atmosphere ?? 0 }).map((_, i) => (
                                        <div key={i} className="w-1 h-1 rounded-full bg-foreground inline-block mx-0.5"></div>
                                    ))}</div>
                                </span>
                            </div>
                            <div className="text-muted-foreground">{destination.description}</div>
                        </div>

                    </CardContent>
                )}
                {destination.status === "wishlist" && (
                    <CardContent>
                        <div>
                            <p className='text-muted-foreground text-xs'>MUST VISIT</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.isArray(destination.neighborhood)
                                    ? (
                                        <>
                                            {destination.neighborhood.slice(0, 3).map((tag: string) => (
                                                <Badge key={tag} className=" rounded-md bg-slate-100 text-secondary-foreground font-normal text-xs px-2 py-1 mt-2">{tag}</Badge>
                                            ))}
                                            {destination.neighborhood.length > 3 && (
                                                <Badge className="rounded-md bg-slate-100 text-secondary-foreground font-normal text-xs px-2 py-0.5 mt-2">+{destination.neighborhood.length - 3}</Badge>
                                            )}
                                        </>
                                    )
                                    : <span>{destination.neighborhood}</span>
                                }
                            </div>
                        </div>
                    </CardContent>
                )}
                <CardFooter>
                </CardFooter>
            </Card>

        </div >
    )
}

export default CityCard
