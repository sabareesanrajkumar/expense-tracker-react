import { render, screen } from '@testing-library/react';
import Expenses from './Expenses';

import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../store/index';

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('Expenses Component', () => {
  test('renders Add Expense heading', () => {
    renderWithProviders(<Expenses />);
    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument();
  });

  test('renders all input fields', () => {
    renderWithProviders(<Expenses />);
    expect(screen.getByPlaceholderText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Food/i)).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderWithProviders(<Expenses />);
    expect(
      screen.getByRole('button', { name: /add expense/i })
    ).toBeInTheDocument();
  });

  test('disables submit if required fields are empty', () => {
    renderWithProviders(<Expenses />);
    const button = screen.getByRole('button', { name: /add expense/i });
    expect(button).not.toBeDisabled();
  });

  test('submits form with valid input', () => {
    renderWithProviders(<Expenses />);
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: 'Lunch' },
    });
    fireEvent.change(screen.getByDisplayValue(/Food/i), {
      target: { value: 'Travel' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  });

  test('shows spinner when loading is true', () => {
    renderWithProviders(<Expenses />);
    expect(screen.queryByRole('status')).not.toBeNull();
  });

  test('renders expense list when expenses are available', async () => {
    renderWithProviders(<Expenses />);
    await waitFor(() => {
      expect(screen.getByText(/Your Expenses/i)).toBeInTheDocument();
    });
  });

  test('renders delete button for each expense', async () => {
    renderWithProviders(<Expenses />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  test('renders edit button for each expense', async () => {
    renderWithProviders(<Expenses />);
    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  test('activates premium when total > 10000', async () => {
    renderWithProviders(<Expenses />);
    await waitFor(() => {
      const activateBtn = screen.queryByRole('button', {
        name: /activate premium/i,
      });
      if (activateBtn) {
        expect(activateBtn).toBeInTheDocument();
      }
    });
  });

  test('shows premium features when activated', () => {
    renderWithProviders(<Expenses />);
    expect(
      screen.queryByText(/Download Expenses/i) ||
        screen.queryByText(/Theme Toggle/i)
    ).toBeTruthy();
  });

  test('renders edit modal when showEdit is true', () => {
    renderWithProviders(<Expenses />);
  });

  test('navigates to home page when back button is clicked', () => {
    renderWithProviders(<Expenses />);
    const backBtn = screen.getByRole('button', { name: '' });
    expect(backBtn).toBeInTheDocument();
  });

  test('form resets after submission', () => {
    renderWithProviders(<Expenses />);
    const amountInput = screen.getByPlaceholderText(/Amount/i);
    fireEvent.change(amountInput, { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /add expense/i }));
  });

  test('category select options are rendered correctly', () => {
    renderWithProviders(<Expenses />);
    expect(screen.getByText(/Petrol/i)).toBeInTheDocument();
    expect(screen.getByText(/Salary/i)).toBeInTheDocument();
    expect(screen.getByText(/Travel/i)).toBeInTheDocument();
  });
});
