import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "../../common/Image/Image";

const CarouselContainer = styled.div<{ type: CarouselType }>`
    display: flex;
    gap: 10px;
    flex-direction: ${props => props.type === CarouselType.HORIZONTAL_SLIDER ? 'row' : 'column'};
    overflow-x: ${props => props.type === CarouselType.HORIZONTAL_SLIDER ? 'auto' : 'hidden'};
    overflow-y: ${props => props.type === CarouselType.VERTICAL_SLIDER ? 'auto' : 'hidden'};
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
`;

export enum CarouselType {
    VERTICAL_SLIDER = 'vSlider',
    HORIZONTAL_SLIDER = 'hSlider',
    GRID = 'grid', //TODO: Implement grid
};

type CarouselProps = {
    type: CarouselType;
};

const Carousel: React.FC<CarouselProps> = ({ type }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<string[]>([]);

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
            const height = Math.floor(Math.random() * 300) + 100;
            const width = Math.floor(Math.random() * 200) + 100;
            i.push(`https://picsum.photos/${width}/${height}`);
        };

        setImages(i);
    }, []);

    return (
        <CarouselContainer type={type} ref={carouselRef}>
            {images.map((image, index) => (
                <Image maxHeight={type === CarouselType.VERTICAL_SLIDER ? undefined : carouselHeight} maxWidth={type === CarouselType.HORIZONTAL_SLIDER ? carouselWidth : undefined} key={index} src={image} alt={`image-${index}`} />
            ))}
        </CarouselContainer>
    );
};

export default Carousel;