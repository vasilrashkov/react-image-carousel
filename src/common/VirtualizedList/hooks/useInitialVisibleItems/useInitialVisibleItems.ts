import { GetNextItemHeight, VirtualizedListItem } from "../../VirtualizedList";
import useNewItem from "../useNewItem/useNewItem";

type GetInitialVisibleItemsProps = {
    renderedHeight: number,
    renderedWidth: number,
    items: VirtualizedListItem[],
    visibleItems: VirtualizedListItem[],
    gapValue: number,

    getNextItemHeight: GetNextItemHeight;
};

const useInitialVisibleItems = () => {
    const { generateNewItem } = useNewItem();

    const getInitialVisibleItems = ({
        renderedHeight,
        renderedWidth,
        items,
        gapValue,

        getNextItemHeight
    }: GetInitialVisibleItemsProps) => {
        let visibleItems: VirtualizedListItem[] = [];
        let itemsHeight = visibleItems.reduce((acc, item) => acc + (item.height ?? 0), 0);
        while (itemsHeight < renderedHeight * 2) {
            const item = getNextItemHeight(items.length, renderedHeight, renderedWidth);

            const newItem: VirtualizedListItem = generateNewItem({
                index: visibleItems.length,
                height: item.height,
                width: item.width,
                top: visibleItems.reduce((prev, curr) => prev + (curr.height ?? 0) + (visibleItems.length === 0 ? 0 : gapValue), 0),
            });
            
            visibleItems = [...visibleItems, newItem];
            
            itemsHeight += item.height;
        }

        return visibleItems;
    };

    return {
        getInitialVisibleItems
    };
};

export default useInitialVisibleItems;