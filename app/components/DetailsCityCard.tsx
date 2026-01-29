import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, DollarSign, MapPin, Palette, ShieldCheck, Sparkles, Star, Utensils } from "lucide-react"
import { DestinationType } from "./CityCard";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";



const DetailsCityCard = ({ onClose, id }: { onClose: () => void; id: number }) => {
    async function fetchOneDestination() {
        const res = await fetch(`/api/destinations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch destination by id");
        console.log("Fetched destination data:", await res.clone().json());
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
        <div className="p-0 m-0">
            <div className="flex items-center justify-between"></div>
            {destination.coverImage && (
                <div className="relative w-full aspect-[3/1] -mt-4 rounded-t-md overflow-hidden">
                    <img
                        src={destination.coverImage}
                        alt={destination.cityName}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
                        <div className="flex items-center justify-between mt-1">
                            <div className="flex text-muted-foreground items-center gap-1 mt-1">
                                <Calendar size={18} />
                                {destination.visitDate}
                            </div>
                            <div>
                                <Badge className='rounded-md capitalize' variant="orange">{destination.status}</Badge>
                            </div>
                        </div>
                    )}
                    {/* Overall Rating */}
                    <div className="flex items-center gap-2  mt-8">
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
                    <h3 className="text-lg font-medium  mt-8">My thoughts</h3>
                    <div className="text-muted-foreground">{destination.description}</div>

                </div>)}
            <div className=" mt-8">
                <h3 className="text-lg font-medium mb-2">Photo gallery</h3>
                {Array.isArray(destination.images) && destination.images.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-[500px] relative">
                            <Carousel className="w-full">
                                <div className="relative">
                                    <CarouselContent>
                                        {destination.images.map((img: any, idx: number) => (
                                            <CarouselItem key={img.imagePath + idx} className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden rounded-lg">
                                                <img
                                                    src={img.imagePath}
                                                    alt={`Photo ${idx + 1}`}
                                                    className="max-h-[350px] max-w-full w-auto h-auto object-contain mx-auto my-0"
                                                    style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow" />
                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full shadow" />
                                </div>
                            </Carousel>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {destination.images.map((img: any, idx: number) => (
                                <button
                                    key={img.imagePath + idx}
                                    className="rounded-md overflow-hidden border-2 border-transparent focus:border-primary focus:outline-none"
                                    style={{ width: 56, height: 56 }}
                                    onClick={() => {
                                        // Scroll to the corresponding slide
                                        const carousel = document.querySelector('[data-slot=\"carousel-content\"] > div');
                                        if (carousel) {
                                            (carousel as HTMLElement).style.transform = `translateX(-${idx * 100}%)`;
                                        }
                                    }}
                                    type="button"
                                    aria-label={`Show photo ${idx + 1}`}
                                >
                                    <img
                                        src={img.imagePath}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground text-sm">No photos available.</div>
                )}
            </div>
            <div>

                <h3 className="text-lg font-medium mt-8">{destination.status === "visited" ? "Neighborhood explored" : <span className="text-muted-foreground">MUST VISIT</span>}</h3>
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



        </div>

    )
}

export default DetailsCityCard
