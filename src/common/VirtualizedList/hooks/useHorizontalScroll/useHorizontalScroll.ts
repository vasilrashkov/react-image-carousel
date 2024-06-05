import { useEffect, useState } from "react";
import { GetNextItemDimentions, VirtualizedListItem } from "../../VirtualizedList";
import useNewItem from '../useNewItem/useNewItem';

type UseHorizontalScrollProps = {
    containerRef: React.RefObject<HTMLDivElement>;
    renderedHeight: number | null;
    renderedWidth: number | null;
    items: VirtualizedListItem[];
    visibleItems: VirtualizedListItem[];
    threshold: number;
    totalItems: number;
    getNextItemDimentions: GetNextItemDimentions;
    gapValue: number;
    setItems: React.Dispatch<React.SetStateAction<VirtualizedListItem[]>>;
    setVisibleItems: React.Dispatch<React.SetStateAction<VirtualizedListItem[]>>;
};

const useHorizontalScroll = ({
    containerRef,
    renderedHeight,
    renderedWidth,
    items,
    visibleItems,
    threshold,
    totalItems,
    getNextItemDimentions,
    gapValue,
    setItems,
    setVisibleItems,
}: UseHorizontalScrollProps) => {
    const { generateNewItem } = useNewItem();
    const [nextItemIndex, setNextItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (nextItemIndex !== null || items.length === 0) return;

        setNextItemIndex(items.length);
    }, [nextItemIndex, items]);

    const onHorizontalScroll = () => {
        if (!containerRef.current || !renderedHeight || !renderedWidth || nextItemIndex === null) return;

        const scrollLeft = containerRef.current.scrollLeft;
        const totalWidth = items.reduce((acc, item) => acc + (item.width ?? 0), 0);
        const lastVisibleItem = visibleItems[visibleItems.length - 1];

        const thresholdValue = threshold;
    
        if (scrollLeft > renderedWidth && scrollLeft < Number((visibleItems[0].left ?? 0) + thresholdValue)) {
            const newItem = items[visibleItems[0].totalItemsIndex - 1 < 0 ? 0 : visibleItems[0].totalItemsIndex - 1];
            setVisibleItems(prevVisibleItems => [newItem, ...prevVisibleItems.slice(0, prevVisibleItems.length - 1)]);
        } else if (scrollLeft + renderedWidth >= ((lastVisibleItem.left ?? 0) + (lastVisibleItem.width ?? 0)) - thresholdValue) {
            if (visibleItems[visibleItems.length - 1].index < items[items.length - 1].index) {
                const newItem = items[visibleItems[visibleItems.length - 1].totalItemsIndex + 1];
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice(1, prevVisibleItems.length), newItem]);
            } else {
                if (nextItemIndex === totalItems) {
                    setNextItemIndex(0);
                }
                setNextItemIndex(prev => (prev ?? 0) + 1);
                const item = getNextItemDimentions(nextItemIndex === totalItems ? 0 : nextItemIndex, renderedHeight, renderedWidth);

                const newItem: VirtualizedListItem = generateNewItem({
                    index: nextItemIndex,
                    totalItemsIndex: items.length,
                    height: item.height,
                    width: item.width,
                    left: totalWidth + gapValue,
                    styleLeft: totalWidth + (items.length * gapValue) + gapValue
                });
        
                setItems(prevItems => [...prevItems, newItem]);
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice((prevVisibleItems.length > 5 ? 1 : 0), prevVisibleItems.length), newItem]);
            }
        }
    };

    return {
        onHorizontalScroll
    };
};

export default useHorizontalScroll;