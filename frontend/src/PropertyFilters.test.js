import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyFilters from './PropertyFilters';

const EMPTY = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: '',
};

test('renders all six inputs and both buttons', () => {
  render(<PropertyFilters onSearch={jest.fn()} />);

  expect(screen.getByLabelText('City')).toBeInTheDocument();
  expect(screen.getByLabelText('Zipcode')).toBeInTheDocument();
  expect(screen.getByLabelText('Min Price')).toBeInTheDocument();
  expect(screen.getByLabelText('Max Price')).toBeInTheDocument();
  expect(screen.getByLabelText('Beds')).toBeInTheDocument();
  expect(screen.getByLabelText('Baths')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Clear Filters' })).toBeInTheDocument();
});

test('submitting calls onSearch with the entered values', async () => {
  const onSearch = jest.fn();
  render(<PropertyFilters onSearch={onSearch} />);

  await userEvent.type(screen.getByLabelText('City'), 'Austin');
  await userEvent.type(screen.getByLabelText('Min Price'), '200000');
  await userEvent.selectOptions(screen.getByLabelText('Beds'), '3');
  await userEvent.click(screen.getByRole('button', { name: 'Search' }));

  expect(onSearch).toHaveBeenCalledWith({
    ...EMPTY,
    city: 'Austin',
    minPrice: '200000',
    beds: '3',
  });
});

test('Clear Filters empties the inputs and calls onSearch with empty filters', async () => {
  const onSearch = jest.fn();
  render(<PropertyFilters onSearch={onSearch} />);

  await userEvent.type(screen.getByLabelText('City'), 'Austin');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Filters' }));

  expect(screen.getByLabelText('City')).toHaveValue('');
  expect(onSearch).toHaveBeenCalledWith(EMPTY);
});