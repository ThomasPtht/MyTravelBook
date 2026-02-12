jest.mock('@/components/ui/tags-input');
import { FormAddDestination } from "@/app/components/FormAddDestination";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { time } from "node:console";


jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {},
}));

// Mock createDestination action
jest.mock('../app/actions/destination', () => ({
    createDestination: jest.fn().mockResolvedValue({ success: true }),
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
        const neighborhoodInput = screen.getByLabelText(/Neighborhood/i);
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
        expect(neighborhoodInput).toBeInTheDocument();
        expect(atmosphereText).toBeInTheDocument();
        expect(foodText).toBeInTheDocument();
        expect(safetyText).toBeInTheDocument();
        expect(cultureText).toBeInTheDocument();


    });

    it('should have a submit button', () => {
        render(<FormAddDestination onClose={jest.fn()} />);
        const submitButton = screen.getByRole('button', { name: /Add Destination/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        const onCloseMock = jest.fn();
        render(<FormAddDestination onClose={onCloseMock} />);
        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should submit form data', async () => {
        render(<FormAddDestination onClose={jest.fn()} />);
        const cityNameInput = screen.getByLabelText(/City Name/i);
        const countryInput = screen.getByLabelText(/Country/i);
        const coverImageInput = screen.getByLabelText(/Cover/i);
        const visitDateInput = screen.getByLabelText(/Visit date/i);
        const descriptionInput = screen.getByLabelText(/Personal notes/i);
        // Remplir les champs obligatoires
        fireEvent.change(cityNameInput, { target: { value: 'Paris' } });
        fireEvent.change(countryInput, { target: { value: 'France' } });
        // Simuler un fichier pour coverImage
        const file = new File(['dummy'], 'cover.png', { type: 'image/png' });
        fireEvent.change(coverImageInput, { target: { files: [file] } });
        fireEvent.change(visitDateInput, { target: { value: '2023-01-01' } });
        fireEvent.change(descriptionInput, { target: { value: 'Had a great time in Paris!' } });
        // Ratings (overallRating, budget, food, safety, culture, atmosphere)
        // On clique sur la 5e étoile de chaque rating (le plus simple)
        // overallRating
        const overallStars = screen.getAllByLabelText('Overall experience')[0]?.parentElement?.querySelectorAll('svg');
        if (overallStars && overallStars.length >= 5) fireEvent.click(overallStars[4]);
        // budget
        const budgetStars = screen.getAllByText('Budget')[0]?.parentElement?.querySelectorAll('svg');
        if (budgetStars && budgetStars.length >= 5) fireEvent.click(budgetStars[4]);
        // food
        const foodStars = screen.getAllByText('Food')[0]?.parentElement?.querySelectorAll('svg');
        if (foodStars && foodStars.length >= 5) fireEvent.click(foodStars[4]);
        // safety
        const safetyStars = screen.getAllByText('Safety')[0]?.parentElement?.querySelectorAll('svg');
        if (safetyStars && safetyStars.length >= 5) fireEvent.click(safetyStars[4]);
        // culture
        const cultureStars = screen.getAllByText('Culture')[0]?.parentElement?.querySelectorAll('svg');
        if (cultureStars && cultureStars.length >= 5) fireEvent.click(cultureStars[4]);
        // atmosphere
        const atmosphereStars = screen.getAllByText('Atmosphere')[0]?.parentElement?.querySelectorAll('svg');
        if (atmosphereStars && atmosphereStars.length >= 5) fireEvent.click(atmosphereStars[4]);
        // Simuler une image pour images[] (gallery)
        // On simule l'upload d'une image dans l'input "Photo gallery (max 5)"
        const galleryInput = screen.getByLabelText(/Photo gallery/i, { selector: 'input[type="file"]' });
        const galleryFile = new File(['dummy'], 'gallery.png', { type: 'image/png' });
        fireEvent.change(galleryInput, { target: { files: [galleryFile] } });
        // Submit
        const submitButton = screen.getByRole('button', { name: /Add Destination/i });
        await fireEvent.click(submitButton);
        await waitFor(() => {
            expect(require('../app/actions/destination').createDestination).toHaveBeenCalledWith(expect.objectContaining({
                cityName: 'Paris',
                country: 'France',
            }));
        });
    });
});


