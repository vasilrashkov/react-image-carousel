import './App.css'
import Carousel, { CarouselType } from './components/Carousel/Carousel';

const App = () => {
    return (
        <div style={{ width: "80%", paddingTop: "50px", paddingBottom: "60px", marginLeft: "10%", height: "400px" }}>
            <Carousel type={CarouselType.HORIZONTAL_SLIDER} />
        </div>
    );
};

export default App;
