import { VirtualizedListItem } from "../../VirtualizedList";

type GetNewItemProps = {
    index: number;
    height: number;
    width: number;
    top: number;

    styleTop?: number;
};

const useNewItem = () => {
    const generateNewItem = ({
        index,
        height,
        width,
        top,
        styleTop
    }: GetNewItemProps) => {
        const newItem: VirtualizedListItem = {
            index,
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