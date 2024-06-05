import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useElementRenderedHeight from "../../hooks/useElementRenderedHeight/useElementRenderedHeight";
import useInitialVisibleItems from "./hooks/useInitialVisibleItems/useInitialVisibleItems";
import useVerticalScroll from "./hooks/useVerticalScroll/useVerticalScroll";
import useHorizontalScroll from "./hooks/useHorizontalScroll/useHorizontalScroll";

export enum VirtualizedListType {
    VERTICAL = 'vertical',
    HORIZONTAL = 'horizontal',
};

type VirtualizedListConfigurations = {
    itemHeight?: number;
    itemWidth?: number;
    threshold: number;
    type: VirtualizedListType;

    /**
     * Gap between items displayed in the list
     */
    gap?: number;

    //TODO: scroll type -> vertical, horizontal
};

export type GetNextItemDimentions = (index: number, renderedHeight: number, renderedWidth: number) => { height: number, width: number };

type VirtualizedListProps = {
    configurations: VirtualizedListConfigurations;
    totalItems: number;

    getNextItemDimentions: GetNextItemDimentions;
    renderItem: (index: number, style: React.CSSProperties) => React.ReactNode;
};

export type VirtualizedListItem = {
    index: number;
    totalItemsIndex: number;
    ref?: React.RefObject<HTMLDivElement> | null;
    style: React.CSSProperties;
    height?: number;
    width?: number;

    left?: number;
    top?: number;
};

const VirtualizedListContainer = styled.div<{ type: VirtualizedListType }>`
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: ${props => props.type === VirtualizedListType.VERTICAL ? "column" : "row"};
    align-items: center;
    gap: 20px;
    position: relative;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const defaultConfigurations: VirtualizedListConfigurations = {
    threshold: 20,
    type: VirtualizedListType.VERTICAL,
    gap: 20
};

const VirtualizedList: React.FC<VirtualizedListProps> = ({
    configurations: { type, threshold, gap },
    totalItems,

    renderItem,
    getNextItemDimentions
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [items, setItems] = useState<VirtualizedListItem[]>([]);
    const [visibleItems, setVisibleItems] = useState<VirtualizedListItem[]>([]);
    
    const gapValue = useMemo(() => {
        return gap ?? (defaultConfigurations.gap as number);
    }, [gap]);

    const { renderedHeight, renderedWidth } = useElementRenderedHeight({ ref: containerRef });
    const { getInitialVisibleItems } = useInitialVisibleItems();
    const { onVerticalScroll } = useVerticalScroll({
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
        setVisibleItems
    });
    const { onHorizontalScroll } = useHorizontalScroll({
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
        setVisibleItems
    });

    useEffect(() => {
        if (!containerRef.current || !renderedHeight || !renderedWidth || items.length > 0 || visibleItems.length > 0) return;

        const newVisibleItems = getInitialVisibleItems({
            renderedHeight,
            renderedWidth,
            virtualizedListType: type,
            items,
            visibleItems,
            gapValue,
            getNextItemDimentions
        });

        setItems(newVisibleItems);
        setVisibleItems(newVisibleItems);

    }, [renderedHeight, renderedHeight, renderedWidth, items, visibleItems, getNextItemDimentions]);

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', type === VirtualizedListType.VERTICAL ? onVerticalScroll : onHorizontalScroll);

        return containerRef.current?.removeEventListener('scroll', type === VirtualizedListType.VERTICAL ? onVerticalScroll : onHorizontalScroll);
    }, [containerRef]);

    return (
        <VirtualizedListContainer type={type} onScroll={type === VirtualizedListType.VERTICAL ? onVerticalScroll : onHorizontalScroll} ref={containerRef}>
            {visibleItems.map((item) => renderItem(item.index, item.style))}
        </VirtualizedListContainer>
    );
};

export default VirtualizedList;