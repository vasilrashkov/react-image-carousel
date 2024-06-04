import { useCallback, useEffect, useRef } from "react";

type InfiniteScrollingProps = {
    hasMore: boolean;
    isLoading: boolean;
    loadMore: () => void;
    loader: React.ReactNode;
    children: React.ReactNode;
    parentElement?: HTMLElement | null;
};

const InfiniteScrolling = ({
    hasMore,
    isLoading,
    loadMore,
    loader,
    children,
    parentElement
} : InfiniteScrollingProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current || isLoading || !hasMore) return;

        const scrollableElement = parentElement || document.documentElement;

        const scrollTop = scrollableElement.scrollTop;
        const scrollHeight = scrollableElement.scrollHeight;
        const clientHeight = scrollableElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            loadMore();
        }
    }, [isLoading, hasMore, loadMore, parentElement]);

    useEffect(() => {
        const scrollableElement = parentElement || document.documentElement;

        scrollableElement.addEventListener('scroll', handleScroll);
        return () => scrollableElement.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} style={{ height: "100%" }}>
            <>
                {children}
                {isLoading && loader}
            </>
        </div>
    );
};

export default InfiniteScrolling;