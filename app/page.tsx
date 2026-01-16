import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";


export default function Home() {
  return (
    <div>
      <Tabs defaultValue="tab-1">
        <div className="border-b">
          <TabsList variant="underline">
            <TabsTab value="tab-1">All destinations</TabsTab>
            <TabsTab value="tab-2">Visited</TabsTab>
            <TabsTab value="tab-3">Wishlist</TabsTab>
          </TabsList>
        </div>
        <TabsPanel value="tab-1">
          <p className="p-4 text-center text-muted-foreground text-xs">
            Tab 1 content
          </p>
        </TabsPanel>
        <TabsPanel value="tab-2">
          <p className="p-4 text-center text-muted-foreground text-xs">
            Tab 2 content
          </p>
        </TabsPanel>
        <TabsPanel value="tab-3">
          <p className="p-4 text-center text-muted-foreground text-xs">
            Tab 3 content
          </p>
        </TabsPanel>
      </Tabs>

    </div>
  )
}
