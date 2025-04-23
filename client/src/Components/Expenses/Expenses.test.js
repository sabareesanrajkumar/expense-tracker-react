import { render, screen } from '@testing-library/react';
import ExpenseForm from './Expenses';

describe('ExpenseForm', () => {
  test('renders all input fields', () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  test('disables submit when required fields empty', () => {
    render(<ExpenseForm onSubmit={jest.fn()} />);
    expect(screen.getByRole('button', { name: /add expense/i })).toBeDisabled();
  });
});
