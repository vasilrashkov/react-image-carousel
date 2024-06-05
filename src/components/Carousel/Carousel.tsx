import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "../../common/Image/Image";
import VirtualizedList, { VirtualizedListType } from "../../common/VirtualizedList/VirtualizedList";

const CarouselContainer = styled.div<{ type: CarouselType }>`
    display: flex;
    gap: 10px;
    flex-direction: ${props => props.type === CarouselType.HORIZONTAL_SLIDER ? 'row' : 'column'};
    overflow-x: ${props => props.type === CarouselType.HORIZONTAL_SLIDER ? 'auto' : 'hidden'};
    overflow-y: ${props => props.type === CarouselType.VERTICAL_SLIDER ? 'auto' : 'hidden'};
    width: 100%;
    height: 100%;
`;

export enum CarouselType {
    VERTICAL_SLIDER = 'vSlider',
    HORIZONTAL_SLIDER = 'hSlider',
    GRID = 'grid', //TODO: Implement grid
};

type CarouselImage = {
    url: string;
    height: number;
    width: number;
};

type CarouselProps = {
    images?: CarouselImage[];
    type: CarouselType;
};

const Carousel: React.FC<CarouselProps> = ({ type }) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const [images, setImages] = useState<CarouselImage[]>([]);

    const [carouselWidth, setCarouselWidth] = useState<number>(0);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);

    useEffect(() => {
        if (!carouselRef.current) return;

        setCarouselHeight(carouselRef.current.offsetHeight);
        setCarouselWidth(carouselRef.current.offsetWidth);
    }, [carouselRef.current]);

    useEffect(() => {
        const i = [];
        for (let x = 0; x < 10; x++) {
            const height = Math.floor(Math.random() * 300) + 600;
            const width = Math.floor(Math.random() * 200) + 600 + (Math.floor(Math.random() * 200) + 100);
            i.push({
                url: `https://picsum.photos/${width}/${height}`,
                height: height,
                width: width
            })
        };

        setImages(i);
    }, []);

    const renderItem = (index: number, style: React.CSSProperties) => {
        const usedIndex = index === images.length ? 0 : index;

        return (
            <Image
                key={`index-${usedIndex}`}
                maxHeight={type === CarouselType.VERTICAL_SLIDER ? undefined : carouselHeight}
                maxWidth={type === CarouselType.HORIZONTAL_SLIDER ? carouselWidth : undefined}
                src={images[usedIndex].url}
                style={style}
                alt={`image-${usedIndex}`}
            />
        );
    };

    const getNextItemHeight = (index: number, containerHeight: number, containerWidth: number) => {
        const usedIndex = index === images.length ? 0 : index;

        const item = images[usedIndex];

        const imageHeight = item.height;
        const imageWidth = item.width;

        const ratio = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);

        return { width: imageWidth * ratio, height: imageHeight * ratio };
    };

    if (!images.length) return (<div>Loading...</div>);

    return (
        <CarouselContainer type={type} ref={carouselRef}>
            <VirtualizedList 
                totalItems={images.length} 
                configurations={{ threshold: 400, type: VirtualizedListType.HORIZONTAL, gap: 20 }} 
                getNextItemDimentions={getNextItemHeight} 
                renderItem={renderItem} />
        </CarouselContainer>
    );
};

export default Carousel;