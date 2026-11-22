import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

let shouldThrow;

function Bomb() {
  if (shouldThrow) throw new Error('boom');
  return <p>All good</p>;
}

beforeEach(() => {
  shouldThrow = true;
  // React logs caught errors to console.error; keep test output readable
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders children when nothing throws', () => {
  shouldThrow = false;
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByText('All good')).toBeInTheDocument();
});

test('shows the recovery UI instead of crashing when a child throws', () => {
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Back to listings' })).toBeInTheDocument();
});

test('"Try again" re-renders the children once the problem is gone', async () => {
  render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>
  );
  shouldThrow = false;
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(screen.getByText('All good')).toBeInTheDocument();
});

test('clears the error when resetKey changes (e.g. user navigates away)', () => {
  const { rerender } = render(
    <ErrorBoundary resetKey="/property/bad">
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();

  shouldThrow = false;
  rerender(
    <ErrorBoundary resetKey="/">
      <Bomb />
    </ErrorBoundary>
  );
  expect(screen.getByText('All good')).toBeInTheDocument();
});
