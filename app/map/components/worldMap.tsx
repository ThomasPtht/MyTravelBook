"use client"

import { useState } from "react";
import { DestinationType } from "@/app/components/CityCard";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/features.json";

const WorldMap = ({ data }: { data: DestinationType[] }) => {
    const [hoveredCountry, setHoveredCountry] = useState<{ name: string; status: string | null } | null>(null);

    const visitedCountries = data
        .filter(dest => dest.status === "visited")
        .map(dest => dest.country)
        .filter((value, index, self) => self.indexOf(value) === index);

    const wishlistCountries = data
        .filter(dest => dest.status === "wishlist")
        .map(dest => dest.country)
        .filter((value, index, self) => self.indexOf(value) === index);

    const getCountryStatus = (countryName: string) => {
        if (visitedCountries.includes(countryName)) return "visited";
        if (wishlistCountries.includes(countryName)) return "wishlist";
        return null;
    };

    const getFillColor = (status: string | null) => {
        switch (status) {
            case "visited": return "#16a34a";
            case "wishlist": return "#e8915a";
            default: return "#D6D6DA";
        }
    };

    const getHoverColor = (status: string | null) => {
        switch (status) {
            case "visited": return "#15803d";
            case "wishlist": return "#d97a3e";
            default: return "#F53";
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
            {/* Tooltip en haut à gauche */}
            {hoveredCountry && (
                <div className="flex items-center gap-2 absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-md">
                    <p className="font-semibold text-sm">{hoveredCountry.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {hoveredCountry.status === "visited" && "Visited ✅"}
                        {hoveredCountry.status === "wishlist" && "Wishlist ✍️"}
                        {!hoveredCountry.status && "🌍 Not visited"}
                    </p>
                </div>
            )}

            <ComposableMap
                projectionConfig={{
                    scale: 147,
                    center: [0, 0],
                }}
                width={800}
                height={400}
                style={{ width: "100%", height: "auto", display: "block" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies
                            .filter((geo) => geo.properties && geo.properties.name && geo.properties.name !== "Antarctica")
                            .map((geo) => {
                                const countryName = geo.properties.name;
                                const status = getCountryStatus(countryName);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={getFillColor(status)}
                                        stroke="#FFFFFF"
                                        strokeWidth={0.5}
                                        onMouseEnter={() => setHoveredCountry({ name: countryName, status })}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        style={{
                                            default: { outline: "none" },
                                            hover: {
                                                fill: getHoverColor(status),
                                                outline: "none",
                                            },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                    }
                </Geographies>

                {/* Légende en bas à droite, directement dans le SVG */}
                <g transform="translate(620, 360)">
                    <rect x="0" y="0" width="160" height="30" rx="6" fill="white" fillOpacity="0.9" stroke="#e5e7eb" />
                    <circle cx="16" cy="15" r="5" fill="#16a34a" />
                    <text x="28" y="19" fontSize="10" fill="#555">Visited</text>
                    <circle cx="96" cy="15" r="5" fill="#e8915a" />
                    <text x="108" y="19" fontSize="10" fill="#555">Wishlist</text>
                </g>
            </ComposableMap>
        </div>
    );
};

export default WorldMap;