jest.mock('@/components/ui/tags-input');
import { FormAddDestination } from "@/app/components/FormAddDestination";
import { render, screen } from "@testing-library/react";


jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {},
}));

describe('FormAddDestination', () => {
    it('should display form fields', () => {
        render(<FormAddDestination onClose={jest.fn()} />);
        const cityNameInput = screen.getByLabelText(/City Name/i);
        const statusInput = screen.getByRole('combobox', { name: /Status/i });
        const countryInput = screen.getByLabelText(/Country/i);
        const coverImageInput = screen.getByLabelText(/Cover/i);
        const visitDateInput = screen.getByLabelText(/Visit Date/i);
        const descriptionInput = screen.getByLabelText(/Personal notes/i);
        const overallRatingText = screen.getByText(/Overall experience/i);
        const budgetText = screen.getByText(/Budget/i);
        // const neighborhoodInput = screen.getByLabelText(/Neighborhood/i);
        const atmosphereText = screen.getByText(/Atmosphere/i);
        const foodText = screen.getByText(/Food/i);
        const safetyText = screen.getByText(/Safety/i);
        const cultureText = screen.getByText(/Culture/i);
        expect(cityNameInput).toBeInTheDocument();
        expect(statusInput).toBeInTheDocument();
        expect(countryInput).toBeInTheDocument();
        expect(coverImageInput).toBeInTheDocument();
        expect(visitDateInput).toBeInTheDocument();
        expect(descriptionInput).toBeInTheDocument();
        expect(overallRatingText).toBeInTheDocument();
        expect(budgetText).toBeInTheDocument();
        // expect(neighborhoodInput).toBeInTheDocument();
        expect(atmosphereText).toBeInTheDocument();
        expect(foodText).toBeInTheDocument();
        expect(safetyText).toBeInTheDocument();
        expect(cultureText).toBeInTheDocument();


    });
});

// indique moi dans le read me , tout ce qui a du etre installé pour setup Jest car je me souviens plus là