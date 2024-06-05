import { VirtualizedListItem } from "../../VirtualizedList";

type GetNewItemProps = {
    index: number;
    totalItemsIndex: number;
    height: number;
    width: number;
    top: number;

    styleTop?: number;
};

const useNewItem = () => {
    const generateNewItem = ({
        index,
        totalItemsIndex,
        height,
        width,
        top,
        styleTop
    }: GetNewItemProps) => {
        const newItem: VirtualizedListItem = {
            index,
            totalItemsIndex,
            height,
            width,
            top,
            style: {
                position: "absolute",
                height: `${height}px`,
                width: `${width}px`,
                top: `${styleTop ?? top}px`,
            }
        };

        return newItem;
    };

    return {
        generateNewItem,
    };
};

export default useNewItem;