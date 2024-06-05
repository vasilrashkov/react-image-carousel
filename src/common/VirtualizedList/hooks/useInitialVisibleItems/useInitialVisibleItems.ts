import { GetNextItemDimentions, VirtualizedListItem, VirtualizedListType } from "../../VirtualizedList";
import useNewItem from "../useNewItem/useNewItem";

type GetInitialVisibleItemsProps = {
    renderedHeight: number,
    renderedWidth: number,
    items: VirtualizedListItem[],
    visibleItems: VirtualizedListItem[],
    gapValue: number,
    virtualizedListType: VirtualizedListType,

    getNextItemDimentions: GetNextItemDimentions;
};

const useInitialVisibleItems = () => {
    const { generateNewItem } = useNewItem();

    const getInitialVisibleItems = ({
        renderedHeight,
        renderedWidth,
        items,
        virtualizedListType,
        gapValue,

        getNextItemDimentions
    }: GetInitialVisibleItemsProps) => {
        let visibleItems: VirtualizedListItem[] = [];
        let itemsHeight = 0;
        let itemsWidth = 0;

        while ((virtualizedListType === VirtualizedListType.VERTICAL && itemsHeight < renderedHeight * 2) || 
               (virtualizedListType === VirtualizedListType.HORIZONTAL && itemsWidth < renderedWidth * 2)) {
            const item = getNextItemDimentions(items.length, renderedHeight, renderedWidth);

            const newItem: VirtualizedListItem = generateNewItem({
                index: visibleItems.length,
                totalItemsIndex: visibleItems.length,
                height: item.height,
                width: item.width,
                top: virtualizedListType === VirtualizedListType.VERTICAL ? visibleItems.reduce((prev, curr) => prev + (curr.height ?? 0) + (visibleItems.length === 0 ? 0 : gapValue), 0) : undefined,
                left: virtualizedListType === VirtualizedListType.HORIZONTAL ? visibleItems.reduce((prev, curr) => prev + (curr.width ?? 0) + (visibleItems.length === 0 ? 0 : gapValue), 0) : 0,
            });
            
            visibleItems = [...visibleItems, newItem];
            
            itemsHeight += item.height;
            itemsWidth += item.width;
        }

        return visibleItems;
    };

    return {
        getInitialVisibleItems
    };
};

export default useInitialVisibleItems;