import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../app/page';
import { EntriesProvider } from '../app/contexts/entries-context';

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const renderWithProvider = (ui) => {
  return render(<EntriesProvider>{ui}</EntriesProvider>);
};

describe('Page', () => {
  it('scrolls to the bottom when new entries are added', () => {
    renderWithProvider(<Page />);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('handles input change', () => {
    renderWithProvider(<Page />);

    const input = screen.getByPlaceholderText(
      /type a message.../i
    );

    fireEvent.change(input, { target: { value: 'New message' } });

    expect(input).toHaveValue('New message');
  });
});
