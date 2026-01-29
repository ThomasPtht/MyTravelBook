export function normalizeDestination(data: any) {
    return {
        cityName: data.cityName,
        country: data.country,
        status: data.status ?? "visited",
        coverImage: data.coverImage ?? "",
        images: data.images ?? [],
        description: data.description ?? "",
        budget: data.budget ?? 0,
        overallRating: data.overallRating ?? 0,
        food: data.food ?? 0,
        safety: data.safety ?? 0,
        culture: data.culture ?? 0,
        atmosphere: data.atmosphere ?? 0,
        neighborhood: Array.isArray(data.neighborhood)
            ? data.neighborhood
            : typeof data.neighborhood === "string" && data.neighborhood !== ""
                ? [data.neighborhood]
                : [],
        visitDate: data.visitDate ?? ""
    };
}