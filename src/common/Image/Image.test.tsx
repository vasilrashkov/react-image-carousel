import { describe, expect } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import Image from './Image';

describe('Image', () => {
    it('renders without crashing', () => {
        const { container } = render(<Image src="test.jpg" />);
        expect(container.firstChild).toBeTruthy();
    });

    it('displays image when there is no error', () => {
        const { getByRole } = render(<Image src="test.jpg" />);
        expect(getByRole('img')).toHaveProperty('src', 'http://localhost/test.jpg');
    });

    it('displays error message when there is an error', () => {
        const { getByText, getByRole, rerender } = render(<Image src="test.jpg" />);
        const img = getByRole('img');
        fireEvent.error(img);
        rerender(<Image src="test.jpg" />);
        expect(getByText('Error loading image')).toBeTruthy();
    });

    it('calls onClick when image is clicked', () => {
        const handleClick = jest.fn();
        const { getByRole } = render(<Image src="test.jpg" onClick={handleClick} />);
        fireEvent.click(getByRole('img'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});