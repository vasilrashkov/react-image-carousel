import { useEffect, useState } from 'react';
import './App.css'
import Carousel, { CarouselImage, CarouselType } from './components/Carousel/Carousel';

const App = () => {
    const [horizontalImages, setHorizontalImages] = useState<CarouselImage[]>([]);
    const [verticalImages, setVerticalImages] = useState<CarouselImage[]>([]);
    
    useEffect(() => {
        const hImages = [];
        const vImages = [];
        for (let x = 0; x < 1000000; x++) {
            const height = Math.floor(Math.random() * 300) + 600;
            const width = Math.floor(Math.random() * 200) + 600 + (Math.floor(Math.random() * 200) + 100);
            hImages.push({
                url: `https://picsum.photos/${width}/${height}`,
                height: height,
                width: width
            });
            vImages.push({
                url: `https://picsum.photos/${height}/${width}`,
                height: width,
                width: height
            });
        };

        setHorizontalImages(hImages);
        setVerticalImages(vImages);
    }, []);

    return (
        <>
            <div style={{ width: "80%", marginLeft: "10%", height: "40vh" }}>
                <Carousel type={CarouselType.HORIZONTAL_SLIDER} images={horizontalImages} />
            </div>
            <div style={{ width: "80%", marginLeft: "10%", marginTop: "10%", height: "50vh" }}>
                <Carousel type={CarouselType.VERTICAL_SLIDER} images={verticalImages} />
            </div>
        </>
    );
};

export default App;
