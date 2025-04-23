import { render, screen } from '@testing-library/react';
import Expenses from './Expenses';

describe('Expenses', () => {
  test('renders all input fields', () => {
    render(<Expenses onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  test('disables submit when required fields empty', () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /add expenses/i })
    ).toBeDisabled();
  });
});
