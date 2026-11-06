import { fetchProperties } from './client';

beforeEach(() => {
  global.fetch = jest.fn();
});

test('calls /api/properties with no query string when there are no params', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ response: [], total: 0 }),
  });

  await fetchProperties();

  expect(global.fetch).toHaveBeenCalledWith('/api/properties');
});

test('only sends filters that have values', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ response: [{ L_ListingID: '1' }], total: 1 }),
  });

  const result = await fetchProperties({
    city: 'Austin',
    zipcode: '',
    minPrice: '200000',
    beds: undefined,
  });

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/properties?city=Austin&minPrice=200000'
  );
  expect(result.total).toBe(1);
});

test('throws a meaningful error when the server responds with an error status', async () => {
  global.fetch.mockResolvedValue({ ok: false, status: 500 });

  await expect(fetchProperties()).rejects.toThrow('Request failed: 500');
});

test('throws a friendly error when the server is unreachable', async () => {
  global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

  await expect(fetchProperties()).rejects.toThrow('Cannot connect to the server');
});