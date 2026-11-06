import { render, screen, fireEvent } from '@testing-library/react';
import Pagination, { getPageNumbers } from './Pagination';
 
//getPageNumbers test
 
describe('getPageNumbers', () => {
  test('shows every page when there are few pages', () => {
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageNumbers(1, 1)).toEqual([1]);
    expect(getPageNumbers(1, 2)).toEqual([1, 2]);
  });
 
  test('first page: ellipsis only after the window', () => {
    expect(getPageNumbers(1, 24)).toEqual([1, 2, '...', 24]);
  });
 
  test('last page: ellipsis only before the window', () => {
    expect(getPageNumbers(24, 24)).toEqual([1, '...', 23, 24]);
  });
 
  test('middle page: ellipsis on both sides', () => {
    expect(getPageNumbers(5, 24)).toEqual([1, '...', 4, 5, 6, '...', 24]);
  });
 
  test('a gap of exactly one page shows that page instead of an ellipsis', () => {
    expect(getPageNumbers(4, 24)).toEqual([1, 2, 3, 4, 5, '...', 24]);
    expect(getPageNumbers(21, 24)).toEqual([1, '...', 20, 21, 22, 23, 24]);
  });
 
  test('near the end: last page appears exactly once (debug challenge)', () => {
    expect(getPageNumbers(23, 24)).toEqual([1, '...', 22, 23, 24]);
    expect(getPageNumbers(22, 24)).toEqual([1, '...', 21, 22, 23, 24]);
  });
 
  test('never repeats or reorders pages, and always includes first and last', () => {
    for (let total = 1; total <= 30; total++) {
      for (let page = 1; page <= total; page++) {
        const result = getPageNumbers(page, total);
        const numbers = result.filter((p) => p !== '...');
 
        expect(numbers[0]).toBe(1);
        expect(numbers[numbers.length - 1]).toBe(total);
        expect(numbers).toContain(page);
        // strictly increasing means no duplicates and correct order
        for (let i = 1; i < numbers.length; i++) {
          expect(numbers[i]).toBeGreaterThan(numbers[i - 1]);
        }
      }
    }
  });
});
 
/* ---------- Pagination component ---------- */
 
function setup(currentPage, totalPages) {
  const onPageChange = jest.fn();
  const utils = render(
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
  return { onPageChange, ...utils };
}
 
describe('Pagination component', () => {
  test('renders nothing when there is only one page', () => {
    const { container } = setup(1, 1);
    expect(container).toBeEmptyDOMElement();
  });
 
  test('renders nothing when there are no pages', () => {
    const { container } = setup(1, 0);
    expect(container).toBeEmptyDOMElement();
  });
 
  test('first page: Previous is disabled and Next is enabled', () => {
    setup(1, 10);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });
 
  test('last page: Next is disabled and Previous is enabled', () => {
    setup(10, 10);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
  });
 
  test('middle page: both Previous and Next are enabled', () => {
    setup(5, 10);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });
 
  test('clicking a page number calls onPageChange with that page', () => {
    const { onPageChange } = setup(5, 24);
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
 
  test('clicking Previous and Next moves one page', () => {
    const { onPageChange } = setup(5, 24);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).toHaveBeenLastCalledWith(6);
  });
 
  test('a disabled Previous button does not call onPageChange', () => {
    const { onPageChange } = setup(1, 10);
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
 
  test('a disabled Next button does not call onPageChange', () => {
    const { onPageChange } = setup(10, 10);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
 
  test('marks only the current page with aria-current', () => {
    setup(5, 24);
    expect(screen.getByRole('button', { name: '5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: '4' })).not.toHaveAttribute('aria-current');
  });
 
  test('renders ellipses as plain text, not buttons: 1 ... 4 5 6 ... 24', () => {
    setup(5, 24);
 
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(2);
    ellipses.forEach((el) => expect(el.closest('button')).toBeNull());
 
    [1, 4, 5, 6, 24].forEach((n) => {
      expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: '10' })).not.toBeInTheDocument();
  });
 
  test('near the end the last page renders only once (debug challenge)', () => {
    setup(23, 24);
    expect(screen.getAllByRole('button', { name: '24' })).toHaveLength(1);
    expect(screen.getAllByText('...')).toHaveLength(1);
  });
});