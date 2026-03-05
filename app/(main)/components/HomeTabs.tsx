"use client";
import { DestinationType } from "@/app/components/CityCard";
import DestinationsList from "@/app/components/DestinationsList";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDownWideNarrow } from "lucide-react";

import { useState } from "react";

export default function HomeTabs() {
    const [tab, setTab] = useState<"all" | "visited" | "wishlist">("all");
    const [sort, setSort] = useState<string>("");



    async function fetchDestinations() {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        return res.json();
    }

    const { data, isLoading, error } = useQuery<DestinationType[]>({
        queryKey: ['destinations'],
        queryFn: fetchDestinations,
    });

  

    const totalVisited = data?.filter(dest => dest.status === "visited").length || 0;
    const totalWishlist = data?.filter(dest => dest.status === "wishlist").length || 0;
    const totalAll = data?.length || 0;


    const sortData = (data: DestinationType[], criteria: string) => { switch (criteria) { case "high": return [...data].sort((a, b) => b.overallRating - a.overallRating); case "low": return [...data].sort((a, b) => a.overallRating - b.overallRating); case "date": return [...data].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()); default: return data; } };

    return (
        <div>
               <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-full max-w-40">
                            <ArrowDownWideNarrow />
                            <SelectValue placeholder="Select a filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort by</SelectLabel>
                                <SelectItem value="high">Rating : high to low</SelectItem>
                                <SelectItem value="low">Rating : low to high</SelectItem>
                                <SelectItem value="date">Date : most recent</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
            <Tabs className='mb-10' value={tab} onValueChange={setTab} defaultValue="all">
                <div className="flex justify-between items-centers border-b mt-2">
                    <TabsList variant="underline">
                        <TabsTab value="all">All destinations ({totalAll})</TabsTab>
                        <TabsTab value="visited">Visited ({totalVisited})</TabsTab>
                        <TabsTab value="wishlist">Wishlist ({totalWishlist})</TabsTab>
                    </TabsList>
                 

                </div>
            </Tabs>
            <DestinationsList data={data ? sortData(data, sort) : []} status={tab} isLoading={isLoading} error={error} />
        </div>
    );
}