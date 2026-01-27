"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import DestinationsList from "../components/DestinationsList";
import { useState } from "react";


export default function Home() {

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
  )
}
