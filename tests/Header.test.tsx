import { render, screen } from '@testing-library/react';
import Header from '@/app/components/Header';
import "@testing-library/jest-dom";

describe('Header', () => {
  it('should render title', () => {
    render(<Header />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();
  });
});

