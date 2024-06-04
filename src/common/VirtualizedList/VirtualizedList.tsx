import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useElementRenderedHeight from "../../hooks/useElementRenderedHeight/useElementRenderedHeight";

type VirtualizedListConfigurations = {
    itemHeight?: number;
    itemWidth?: number;
    threshold: number;

    /**
     * Gap between items displayed in the list
     */
    gap?: number;

    //TODO: scroll type -> vertical, horizontal
};

type VirtualizedListProps = {
    configurations: VirtualizedListConfigurations;
    totalItems: number;

    getNextItemHeight: (index: number, renderedHeight: number, renderedWidth: number) => { height: number, width: number };
    renderItem: (index: number, style: React.CSSProperties) => React.ReactNode;
};

type VirtualizedListItem = {
    index: number;
    ref?: React.RefObject<HTMLDivElement> | null;
    style: React.CSSProperties;
    height?: number;
    width?: number;

    top: number;
};

const VirtualizedListContainer = styled.div`
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const defaultConfigurations: VirtualizedListConfigurations = {
    threshold: 20,
    gap: 20
};

const VirtualizedList: React.FC<VirtualizedListProps> = ({
    configurations: { itemHeight, threshold, gap },
    totalItems,

    renderItem,
    getNextItemHeight
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [items, setItems] = useState<VirtualizedListItem[]>([]);
    const [visibleItems, setVisibleItems] = useState<VirtualizedListItem[]>([]);
    const [itemHeightState, setItemHeightState] = useState<number | null>(itemHeight ?? null);

    const { renderedHeight, renderedWidth } = useElementRenderedHeight({ ref: containerRef });

    useEffect(() => {
        if (itemHeightState) return;

        setItemHeightState(itemHeight ?? (renderedHeight ?? null));
    }, [itemHeight, renderedHeight]);
    
    const onScroll = () => {
        if (!containerRef.current || !itemHeightState || !renderedHeight || !renderedWidth) return;
    
        const scrollTop = containerRef.current.scrollTop;
        const totalHeight = items.reduce((acc, item) => acc + (item.height ?? 0), 0);
        const lastVisibleItem = visibleItems[visibleItems.length - 1];

        const thresholdValue = (threshold) ;
    
        if (scrollTop > renderedHeight && scrollTop < Number(visibleItems[0].top + thresholdValue)) {
            const newItem = items[visibleItems[0].index - 1 < 0 ? 0 : visibleItems[0].index - 1];
            setVisibleItems(prevVisibleItems => [newItem, ...prevVisibleItems.slice(0, prevVisibleItems.length - 1)]);
        } else if (scrollTop + renderedHeight >= (lastVisibleItem.top + (lastVisibleItem.height ?? itemHeightState)) - thresholdValue) {
            if (visibleItems[visibleItems.length - 1].index < items[items.length - 1].index) {
                const newItem = items[visibleItems[visibleItems.length - 1].index + 1];
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice(1, prevVisibleItems.length), newItem]);
            } else {
                const item = getNextItemHeight((items.length === totalItems - 1 ? 0 : items.length), itemHeightState, renderedWidth);
                
                const newItem: VirtualizedListItem = {
                    index: items.length,
                    height: item.height,
                    width: item.width,
                    top: totalHeight + (gap ?? (defaultConfigurations.gap as number)),
                    style: {
                        position: "absolute",
                        height: `${item.height}px`,
                        width: `${item.width}px`,
                        top: `${totalHeight + (items.length * (gap ?? (defaultConfigurations.gap as number))) + (gap ?? (defaultConfigurations.gap as number))}px`,
                    }
                };
        
                setItems(prevItems => [...prevItems, newItem]);
                setVisibleItems(prevVisibleItems => [...prevVisibleItems.slice((prevVisibleItems.length > 5 ? 1 : 0), prevVisibleItems.length), newItem]);
            }
        }
    };

    useEffect(() => {
        if (!containerRef.current || !itemHeightState || !renderedHeight || !renderedWidth || items.length > 0 || visibleItems.length > 0) return;

        let newVisibleItems = [...visibleItems];
        while (newVisibleItems.reduce((acc, item) => acc + (item.height ?? 0), 0) < renderedHeight * 2) {
            const item = getNextItemHeight(items.length, renderedHeight, renderedWidth);

            const newItem: VirtualizedListItem = {
                index: newVisibleItems.length,
                height: item.height,
                width: item.width,
                top: newVisibleItems.reduce((prev, curr) => prev + (curr.height ?? 0) + (newVisibleItems.length === 0 ? 0 : (gap ?? (defaultConfigurations.gap as number))), 0),
                style: {
                    position: "absolute",
                    height: `${item.height}px`,
                    width: `${item.width}px`,
                    top: `${newVisibleItems.reduce((prev, curr) => prev + (curr.height ?? 0) + (newVisibleItems.length === 0 ? 0 : (gap ?? (defaultConfigurations.gap as number))), 0)}px`,
                }
            };

            newVisibleItems = [...newVisibleItems, newItem];
        }

        setItems(newVisibleItems);
        setVisibleItems(newVisibleItems);

    }, [renderedHeight, renderedHeight, renderedWidth, items, visibleItems, itemHeightState, getNextItemHeight]);

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', onScroll);

        return containerRef.current?.removeEventListener('scroll', onScroll);
    }, [containerRef]);

    return (
        <VirtualizedListContainer onScroll={onScroll} ref={containerRef}>
            {visibleItems.map((item) => renderItem(item.index, item.style))}
        </VirtualizedListContainer>
    );
};

export default VirtualizedList;