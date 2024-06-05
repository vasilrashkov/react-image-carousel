import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useElementRenderedHeight from "../../hooks/useElementRenderedHeight/useElementRenderedHeight";
import useInitialVisibleItems from "./hooks/useInitialVisibleItems/useInitialVisibleItems";
import useVerticalScroll from "./hooks/useVerticalScroll/useVerticalScroll";

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

export type GetNextItemHeight = (index: number, renderedHeight: number, renderedWidth: number) => { height: number, width: number };

type VirtualizedListProps = {
    configurations: VirtualizedListConfigurations;
    totalItems: number;

    getNextItemHeight: GetNextItemHeight;
    renderItem: (index: number, style: React.CSSProperties) => React.ReactNode;
};

export type VirtualizedListItem = {
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
    configurations: { threshold, gap },
    totalItems,

    renderItem,
    getNextItemHeight
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
        getNextItemHeight,
        gapValue,
        setItems,
        setVisibleItems
    });

    useEffect(() => {
        if (!containerRef.current || !renderedHeight || !renderedWidth || items.length > 0 || visibleItems.length > 0) return;

        const newVisibleItems = getInitialVisibleItems({
            renderedHeight,
            renderedWidth,
            items,
            visibleItems,
            gapValue,
            getNextItemHeight
        });

        setItems(newVisibleItems);
        setVisibleItems(newVisibleItems);

    }, [renderedHeight, renderedHeight, renderedWidth, items, visibleItems, getNextItemHeight]);

    useEffect(() => {
        containerRef.current?.addEventListener('scroll', onVerticalScroll);

        return containerRef.current?.removeEventListener('scroll', onVerticalScroll);
    }, [containerRef]);

    return (
        <VirtualizedListContainer onScroll={onVerticalScroll} ref={containerRef}>
            {visibleItems.map((item) => renderItem(item.index, item.style))}
        </VirtualizedListContainer>
    );
};

export default VirtualizedList;