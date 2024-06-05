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

    const onVerticalScroll = () => {
        if (!containerRef.current || !renderedHeight || !renderedWidth) return;

        const scrollTop = containerRef.current.scrollTop;
        const totalHeight = items.reduce((acc, item) => acc + (item.height ?? 0), 0);
        const lastVisibleItem = visibleItems[visibleItems.length - 1];

        const thresholdValue = (threshold) ;
    
        if (scrollTop > renderedHeight && scrollTop < Number(visibleItems[0].top + thresholdValue)) {
            const newItem = items[visibleItems[0].index - 1 < 0 ? 0 : visibleItems[0].index - 1];
            setVisibleItems(prevVisibleItems => [newItem, ...prevVisibleItems.slice(0, prevVisibleItems.length - 1)]);
        } else if (scrollTop + renderedHeight >= (lastVisibleItem.top + (lastVisibleItem.height ?? 0)) - thresholdValue) {
            if (visibleItems[visibleItems.length - 1].index < items[items.length - 1].index) {
                const newItem = items[visibleItems[visibleItems.length - 1].index + 1];
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice(1, prevVisibleItems.length), newItem]);
            } else {
                const item = getNextItemHeight((items.length === totalItems - 1 ? 0 : items.length), renderedHeight, renderedWidth);

                const newItem: VirtualizedListItem = generateNewItem({
                    index: items.length,
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