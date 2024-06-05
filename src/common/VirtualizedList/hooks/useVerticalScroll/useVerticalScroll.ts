import { useEffect, useState } from "react";
import { GetNextItemHeight, VirtualizedListItem } from "../../VirtualizedList";
import useNewItem from '../useNewItem/useNewItem';

type UseVerticalScrollProps = {
    containerRef: React.RefObject<HTMLDivElement>;
    renderedHeight: number | null;
    renderedWidth: number | null;
    items: VirtualizedListItem[];
    visibleItems: VirtualizedListItem[];
    threshold: number;
    totalItems: number;
    getNextItemHeight: GetNextItemHeight;
    gapValue: number;
    setItems: React.Dispatch<React.SetStateAction<VirtualizedListItem[]>>;
    setVisibleItems: React.Dispatch<React.SetStateAction<VirtualizedListItem[]>>;
};

const useVerticalScroll = ({
    containerRef,
    renderedHeight,
    renderedWidth,
    items,
    visibleItems,
    threshold,
    totalItems,
    getNextItemHeight,
    gapValue,
    setItems,
    setVisibleItems,
}: UseVerticalScrollProps) => {
    const { generateNewItem } = useNewItem();
    const [nextItemIndex, setNextItemIndex] = useState<number | null>(null);

    useEffect(() => {
        if (nextItemIndex !== null || items.length === 0) return;

        setNextItemIndex(items.length);
    }, [nextItemIndex, items]);

    const onVerticalScroll = () => {
        if (!containerRef.current || !renderedHeight || !renderedWidth || nextItemIndex === null) return;

        const scrollTop = containerRef.current.scrollTop;
        const totalHeight = items.reduce((acc, item) => acc + (item.height ?? 0), 0);
        const lastVisibleItem = visibleItems[visibleItems.length - 1];

        const thresholdValue = (threshold) ;
    
        if (scrollTop > renderedHeight && scrollTop < Number(visibleItems[0].top + thresholdValue)) {
            const newItem = items[visibleItems[0].totalItemsIndex - 1 < 0 ? 0 : visibleItems[0].totalItemsIndex - 1];
            setVisibleItems(prevVisibleItems => [newItem, ...prevVisibleItems.slice(0, prevVisibleItems.length - 1)]);
        } else if (scrollTop + renderedHeight >= (lastVisibleItem.top + (lastVisibleItem.height ?? 0)) - thresholdValue) {
            // if we have scrolled down, then up,
            // and the last visible item is not the last item we have ever rendered (index based),
            // no need to generate new item
            // reuse the ones we have stored in the items state.
            if (visibleItems[visibleItems.length - 1].index < items[items.length - 1].index) {
                const newItem = items[visibleItems[visibleItems.length - 1].totalItemsIndex + 1];
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice(1, prevVisibleItems.length), newItem]);
            } else {
                //TODO: currently it is stacking the images after reaching the end
                //TODO: simply reuse the rendered items (determine by index)
                if (nextItemIndex === totalItems) {
                    setNextItemIndex(0);
                }
                setNextItemIndex(prev => (prev ?? 0) + 1);
                const item = getNextItemHeight(nextItemIndex === totalItems ? 0 : nextItemIndex, renderedHeight, renderedWidth);

                const newItem: VirtualizedListItem = generateNewItem({
                    index: nextItemIndex,
                    totalItemsIndex: items.length,
                    height: item.height,
                    width: item.width,
                    top: totalHeight + gapValue,
                    styleTop: totalHeight + (items.length * gapValue) + gapValue
                });
        
                setItems(prevItems => [...prevItems, newItem]);
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice((prevVisibleItems.length > 5 ? 1 : 0), prevVisibleItems.length), newItem]);
            }
        }
    };

    return {
        onVerticalScroll
    };
};

export default useVerticalScroll;