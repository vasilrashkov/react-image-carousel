import './App.css'
import Carousel, { CarouselType } from './components/Carousel/Carousel';

const App = () => {
    return (
        <div style={{ width: "80%", marginLeft: "10%", height: "100vh" }}>
            <Carousel type={CarouselType.VERTICAL_SLIDER} />
        </div>
    );
};

export default App;
