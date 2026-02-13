"use client"

import { DestinationType } from "@/app/components/CityCard";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/features.json";

const WorldMap = ({ data }: { data: DestinationType[] }) => {

    const visitedCountries = data
        .filter(dest => dest.status === "visited")
        .map(dest => dest.country)
        .filter((value, index, self) => self.indexOf(value) === index);

    return (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <ComposableMap
                projectionConfig={{
                    scale: 147,
                    center: [0, 0],
                }}
                width={800}
                height={400}
                style={{ width: "100%", height: "auto" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies
                            .filter((geo) => geo.properties && geo.properties.name)
                            .map((geo) => {
                                const countryName = geo.properties.name;
                                const isVisited = visitedCountries.includes(countryName);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={isVisited ? "#4ade80" : "#D6D6DA"}
                                        stroke="#FFFFFF"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: {
                                                fill: isVisited ? "#22c55e" : "#F53",
                                                outline: "none",
                                            },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default WorldMap;