
import { render, screen } from '@testing-library/react';
// Mock du composant FormAddDestination pour éviter d'importer du code serveur/Prisma
jest.mock('@/app/components/FormAddDestination', () => ({
  FormAddDestination: () => <div data-testid="mock-form-add-destination" />,
}));
import Header from '@/app/components/Header';
import { SessionProvider } from 'next-auth/react';


describe('Header', () => {
  it('should render title', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    );
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
});

