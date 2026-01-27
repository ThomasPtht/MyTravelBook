"use client";
import DestinationsList from "@/app/components/DestinationsList";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

import { useState } from "react";

export default function HomeTabs() {
    const [tab, setTab] = useState<"all" | "visited" | "wishlist">("all");

    return (
        <div>
            <Tabs className='mb-10' value={tab} onValueChange={setTab} defaultValue="all">
                <div className="border-b">
                    <TabsList variant="underline">
                        <TabsTab value="all">All destinations</TabsTab>
                        <TabsTab value="visited">Visited</TabsTab>
                        <TabsTab value="wishlist">Wishlist</TabsTab>
                    </TabsList>
                </div>
            </Tabs>
            <DestinationsList status={tab} />
        </div>
    );
}