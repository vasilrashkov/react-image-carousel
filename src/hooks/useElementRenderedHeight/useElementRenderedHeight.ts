import { RefObject, useEffect, useState } from "react";

type UseElementRenderedHeightProps = {
    ref: RefObject<HTMLElement>;
};

type UseElementRenderedHeightReturn = {
    renderedWidth: number;
    renderedHeight: number;
};

type UseElementRenderedHeightType = (props: UseElementRenderedHeightProps) => UseElementRenderedHeightReturn;

const useElementRenderedHeight: UseElementRenderedHeightType = ({ ref }) => {
    const [renderedHeight, setRenderedHeight] = useState<number>(0);
    const [renderedWidth, setRenderedWidth] = useState<number>(0);

    useEffect(() => {
        if (!ref.current) return;

        setRenderedHeight(ref.current.offsetHeight);
        setRenderedWidth(ref.current.offsetWidth);
    }, [ref.current]);

    return {
        renderedWidth,
        renderedHeight,
    };
};

export default useElementRenderedHeight;