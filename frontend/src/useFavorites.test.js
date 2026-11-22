import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesProvider, useFavorites } from './useFavorites';

const PROPERTY = {
  L_ListingID: 'A1',
  L_Address: '1 Main St',
  L_SystemPrice: 500000,
  L_Remarks: 'long text we do not want to store',
};

function Probe() {
  const { count, isFavorite, toggleFavorite } = useFavorites();
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="fav">{String(isFavorite('A1'))}</span>
      <button onClick={() => toggleFavorite(PROPERTY)}>toggle</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <FavoritesProvider>
      <Probe />
    </FavoritesProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('toggling adds and then removes a favorite', async () => {
  renderProbe();
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  expect(screen.getByTestId('fav')).toHaveTextContent('false');

  await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
  expect(screen.getByTestId('count')).toHaveTextContent('1');
  expect(screen.getByTestId('fav')).toHaveTextContent('true');

  await userEvent.click(screen.getByRole('button', { name: 'toggle' }));
  expect(screen.getByTestId('count')).toHaveTextContent('0');
  expect(screen.getByTestId('fav')).toHaveTextContent('false');
});

test('favorites persist across a "refresh" and only a slim snapshot is stored', async () => {
  const first = renderProbe();
  await userEvent.click(screen.getByRole('button', { name: 'toggle' }));

  const stored = JSON.parse(localStorage.getItem('favorites'));
  expect(stored[0].L_ListingID).toBe('A1');
  expect(stored[0]).not.toHaveProperty('L_Remarks');

  first.unmount();
  renderProbe(); // new mount, like reloading the page
  expect(screen.getByTestId('fav')).toHaveTextContent('true');
  expect(screen.getByTestId('count')).toHaveTextContent('1');
});

test('corrupted localStorage does not crash the app', () => {
  localStorage.setItem('favorites', 'not json');
  renderProbe();
  expect(screen.getByTestId('count')).toHaveTextContent('0');

  localStorage.setItem('favorites', '{"a":1}'); // valid JSON, wrong shape
  renderProbe();
  expect(screen.getAllByTestId('count')[1]).toHaveTextContent('0');
});
