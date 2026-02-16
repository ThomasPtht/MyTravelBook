
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock du composant FormAddDestination pour éviter d'importer du code serveur/Prisma
jest.mock('@/app/components/FormAddDestination', () => ({
  FormAddDestination: () => <div data-testid="mock-form-add-destination" />,
}));
import Header from '@/app/components/Header';
import { SessionProvider } from 'next-auth/react';
import userEvent from '@testing-library/user-event'


describe('Header', () => {
  it('should render title, subtitle and add button', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    );
    const title = screen.getByRole('heading', { name: /my travel book/i });
    expect(title).toBeInTheDocument();
    const subtitle = screen.getByText(/explore, rate and remember your favorite cities/i);
    expect(subtitle).toBeInTheDocument();
    const addButtons = screen.getAllByRole('button', { name: /add destination/i });
    expect(addButtons.length).toBeGreaterThan(0);
  });


  it('should open dialog when add button is clicked', () => {
    render(
      <SessionProvider session={null}>
        <Header />
      </SessionProvider>
    );

    const addButton = screen.getByRole('button', { name: /add destination/i });
    fireEvent.click(addButton);

    const dialogContent = screen.queryByTestId('mock-form-add-destination');
    expect(dialogContent).toBeInTheDocument();

  });

  it('should display user avatar and dropdown menu when session exists', async () => {
    const mockSession = {
      user: {
        id: '1',
        username: 'testuser',
        name: 'Test User',
        email: 'test@gmail.com',
      },
      expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // expires in 1 hour
    };
    render(
      <SessionProvider session={mockSession}>
        <Header />
      </SessionProvider>
    );
    const avatarTrigger = screen.getByTestId('avatar-trigger');
    expect(avatarTrigger).toBeInTheDocument();
    await userEvent.click(avatarTrigger);
    const dropdownContent = await screen.findByTestId('dropdown-menu-content');
    expect(dropdownContent).toBeInTheDocument();
    expect(screen.getByText(/se déconnecter/i)).toBeInTheDocument();
  });
});
