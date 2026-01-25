import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, DollarSign, MapPin, Palette, ShieldCheck, Sparkles, Star, Utensils } from "lucide-react"
import { DestinationType } from "./CityCard";
import { useQuery } from "@tanstack/react-query";



const DetailsCityCard = ({ onClose, id }: { onClose: () => void; id: number }) => {
    async function fetchOneDestination() {
        const res = await fetch(`/api/destinations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch destination by id");
        return res.json();
    }
    console.log("Destination ID:", id);

    const { data, isLoading, error } = useQuery<DestinationType>({
        queryKey: ['destination', id],
        queryFn: fetchOneDestination,
        enabled: !!id,
        retry: 1, // Limite les tentatives
        staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    });

    if (isLoading) return (
        <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
    );

    if (error) return (
        <div className="text-center p-8 text-red-500">
            Error loading destination. Please try again.
        </div>
    );


    if (!data) {
        return <div>No destination to display</div>
    }
    const destination = data;

    return (

        <div className="">
            <div className="flex items-center justify-between">
            </div>
            {destination.coverImage && (
                <div className="relative w-full aspect-[4/3] overflow-hidden">
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
                            <div className="flex">
                                {Array.from({ length: destination.budget ?? 0 }).map((_, i) => (
                                    <div key={i} ><Star size={10} /></div>
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


            )}
            {destination.status === "wishlist" && (

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

            )}

        </div>

    )
}

export default DetailsCityCard
