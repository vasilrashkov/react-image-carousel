import { renderHook, act } from '@testing-library/react-hooks';
import useHorizontalScroll from './useHorizontalScroll';

describe('useHorizontalScroll', () => {
    let containerRef: any;
    let setItems: any;
    let setVisibleItems: any;
    let getNextItemDimentions: any;
    let generateNewItem: any;

    beforeEach(() => {
        containerRef = { current: { scrollLeft: 0 } };
        setItems = jest.fn();
        setVisibleItems = jest.fn();
        getNextItemDimentions = jest.fn().mockReturnValue({ height: 100, width: 100 });
        generateNewItem = jest.fn().mockReturnValue({});

        jest.mock('../useNewItem/useNewItem', () => ({
            __esModule: true,
            default: () => ({ generateNewItem }),
        }));
    });

    it('should add new item when scrolling to the right end', () => {
        const { result } = renderHook(() => useHorizontalScroll({
            containerRef,
            renderedHeight: 100,
            renderedWidth: 100,
            items: [{ index: 0, totalItemsIndex: 0, style: {}, width: 50, left: 0 }, { index: 1, totalItemsIndex: 1, style: {}, width: 50, left: 50 }],
            visibleItems: [{ index: 0, totalItemsIndex: 0, style: {}, width: 50, left: 0 }, { index: 1, totalItemsIndex: 1, style: {}, width: 50, left: 50 }],
            threshold: 10,
            totalItems: 3,
            getNextItemDimentions,
            gapValue: 10,
            setItems,
            setVisibleItems,
        }));

        containerRef.current.scrollLeft = 90;
        act(() => {
            result.current.onHorizontalScroll();
        });

        expect(setItems).toHaveBeenCalled();
        expect(setVisibleItems).toHaveBeenCalled();
    });

    it('should add new item when scrolling to the left end', () => {
        const { result } = renderHook(() => useHorizontalScroll({
            containerRef,
            renderedHeight: 100,
            renderedWidth: 100,
            items: [{ index: 0, totalItemsIndex: 0, style: {}, width: 50, left: 0 }, { index: 1, totalItemsIndex: 1, style: {}, width: 50, left: 50 }, { index: 2, totalItemsIndex: 2, style: {}, width: 50, left: 100 }],
            visibleItems: [{ index: 1, totalItemsIndex: 1, style: {}, width: 50, left: 50 }, { index: 2, totalItemsIndex: 2, style: {}, width: 50, left: 100 }],
            threshold: 10,
            totalItems: 3,
            getNextItemDimentions,
            gapValue: 10,
            setItems,
            setVisibleItems,
        }));

        containerRef.current.scrollLeft = 200;
        act(() => {
            result.current.onHorizontalScroll();
        });

        expect(setVisibleItems).toHaveBeenCalled();
    });
});