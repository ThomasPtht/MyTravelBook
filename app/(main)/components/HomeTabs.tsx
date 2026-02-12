"use client";
import { DestinationType } from "@/app/components/CityCard";
import DestinationsList from "@/app/components/DestinationsList";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownWideNarrow } from "lucide-react";

import { useState } from "react";

export default function HomeTabs() {
    const [tab, setTab] = useState<"all" | "visited" | "wishlist">("all");



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

    return (
        <div>
            <Tabs className='mb-10' value={tab} onValueChange={setTab} defaultValue="all">
                <div className="flex justify-between items-centers border-b">
                    <TabsList variant="underline">
                        <TabsTab value="all">All destinations ({totalAll})</TabsTab>
                        <TabsTab value="visited">Visited ({totalVisited})</TabsTab>
                        <TabsTab value="wishlist">Wishlist ({totalWishlist})</TabsTab>
                    </TabsList>
                    <Select>
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
                </div>
            </Tabs>
            <DestinationsList data={data} status={tab} isLoading={isLoading} error={error} />
        </div>
    );
}