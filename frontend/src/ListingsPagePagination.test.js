import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListingsPage from './ListingsPage';
import { fetchProperties } from './api/client.js';
 
jest.mock('./api/client.js');
jest.mock('./PropertyCard', () => ({
  __esModule: true,
  default: ({ property }) =>
    require('react').createElement('div', { 'data-testid': 'card' }, property.L_ListingID),
}));
 
// 100 results = 5 pages of 20
function setup() {
  window.scrollTo = jest.fn();
  fetchProperties.mockResolvedValue({
    response: [{ L_ListingID: 'A1' }],
    total: 100,
  });
  render(<ListingsPage />);
}
 
test('shows the X-Y of Z summary and updates it on page 2', async () => {
  setup();
  expect(await screen.findByText('Showing 1-20 of 100 properties')).toBeInTheDocument();
 
  await userEvent.click(await screen.findByRole('button', { name: '2' }));
 
  expect(await screen.findByText('Showing 21-40 of 100 properties')).toBeInTheDocument();
});
 
test('changing page fetches with the right offset and scrolls to the top', async () => {
  setup();
  await userEvent.click(await screen.findByRole('button', { name: '3' }));
 
  await waitFor(() =>
    expect(fetchProperties).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 20, offset: 40 })
    )
  );
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});
 
test('changing page keeps the active filters', async () => {
  setup();
  await screen.findByRole('button', { name: '2' });
 
  await userEvent.type(screen.getByLabelText('City'), 'Austin');
  await userEvent.click(screen.getByRole('button', { name: 'Search' }));
  await userEvent.click(await screen.findByRole('button', { name: '2' }));
 
  await waitFor(() =>
    expect(fetchProperties).toHaveBeenLastCalledWith(
      expect.objectContaining({ city: 'Austin', offset: 20 })
    )
  );
});
 
test('applying new filters resets to page 1', async () => {
  setup();
  await userEvent.click(await screen.findByRole('button', { name: '3' }));
  await waitFor(() =>
    expect(fetchProperties).toHaveBeenLastCalledWith(expect.objectContaining({ offset: 40 }))
  );
 
  await userEvent.type(screen.getByLabelText('City'), 'Denver');
  await userEvent.click(screen.getByRole('button', { name: 'Search' }));
 
  await waitFor(() =>
    expect(fetchProperties).toHaveBeenLastCalledWith(
      expect.objectContaining({ city: 'Denver', offset: 0 })
    )
  );
});
 
test('hides pagination when there is only one page of results', async () => {
  window.scrollTo = jest.fn();
  fetchProperties.mockResolvedValue({ response: [{ L_ListingID: 'A1' }], total: 5 });
  render(<ListingsPage />);
 
  expect(await screen.findByText('Showing 1-5 of 5 properties')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
});