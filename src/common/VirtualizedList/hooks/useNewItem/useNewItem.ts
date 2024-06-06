import { VirtualizedListItem } from "../../VirtualizedList";

type GetNewItemProps = {
    index: number;
    totalItemsIndex: number;
    height: number;
    width: number;
    top?: number;
    styleTop?: number;
    left?: number;
    styleLeft?: number;
};

const useNewItem = () => {
    const generateNewItem = ({
        index,
        totalItemsIndex,
        height,
        width,
        top,
        styleTop,
        left,
        styleLeft,
    }: GetNewItemProps) => {
        const newItem: VirtualizedListItem = {
            index,
            totalItemsIndex,
            height,
            width,
            top,
            left,
            style: {
                position: "absolute",
                height: `${height}px`,
                width: `${width}px`,
                ...((styleTop !== undefined || top !== undefined) && { top: `${styleTop ?? top}px` }),
                ...((styleLeft !== undefined || left !== undefined) && { left: `${styleLeft ?? left}px` }),
            }
        };
        return newItem;
    };

    return {
        generateNewItem,
    };
};

export default useNewItem;