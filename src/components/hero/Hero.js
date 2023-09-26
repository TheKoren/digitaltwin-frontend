import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {Paper, Typography} from '@mui/material';

import image1 from '../../public/info.jpg';
import image2 from '../../public/topology.jpg';
import image3 from '../../public/analysis.jpg';
import image4 from '../../public/carousel.jpg';

const images = [
    {
        src: image1,
        caption: 'Information',
    },
    {
        src: image2,
        caption: "Topology",
    },
    {
        src: image3,
        caption: "Analysis"
    },
];

const background = image4;

import './Hero.css';

const Hero = () => {
    return (
        <div className="carousel-container"> {/* Apply styles to the container */}
            <Carousel
                animation="fade"
                timeout={5000}
                swipe={true}
                indicators={true}
                navButtonsAlwaysInvisible={true}
            >
                {images.map((image, index) => (
                    <Paper key={index}>
                        <div className='card-container'>
                            <div className="card" style={{ "--img": `url(${background})` }}>
                                <div className="detail">
                                    <div className="poster">
                                        <img src={image.src} alt={`Slide ${index + 1}`}/>
                                    </div>
                                    <div className="title">
                                        <h4>{image.caption}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Paper>
                ))}
            </Carousel>
        </div>
    )
}

export default Hero;