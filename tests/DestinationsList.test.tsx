import DestinationsList from "@/app/components/DestinationsList";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {},
}));

describe('DestinationsList', () => {
    const queryClient = new QueryClient();

    it('should display loading state', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DestinationsList status="all" isLoading={true} error={false} data={[]} />
            </QueryClientProvider>
        );
        const loader = screen.getByTestId('loader');
        expect(loader).toBeInTheDocument();
    });

    it('should display error state', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DestinationsList status="all" isLoading={false} error={true} data={[]} />
            </QueryClientProvider>
        );
        const errorMessage = screen.getByText(/Error loading destinations/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('should display empty state', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DestinationsList status="all" isLoading={false} error={false} data={[]} />
            </QueryClientProvider>
        );
        const emptyMessage = screen.getByText(/No destination to display/i);
        expect(emptyMessage).toBeInTheDocument();
    });

    it('should display list of destinations', () => {
        const mockDestination = {
            id: 1,
            cityName: 'Paris',
            country: 'France',
            status: "visited" as "visited",
            visitDate: '2026-02-09',
            coverImage: '',
            neighborhood: ['Montmartre'],
            description: 'Belle ville',
            overallRating: 4,
            budget: 5,
            food: 5,
            safety: 4,
            culture: 5,
            atmosphere: 4,
            createdAt: new Date('2026-02-09'),
            updatedAt: new Date('2026-02-09'),
            images: [],
            userId: 1,
            user: undefined,
        };
        render(
            <QueryClientProvider client={queryClient}>
                <DestinationsList status="all" isLoading={false} error={false} data={[mockDestination]} />
            </QueryClientProvider>
        );
        const parisCard = screen.findByText(/Paris/i);
        expect(parisCard).resolves.toBeTruthy();

    });
});