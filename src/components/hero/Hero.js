import React from 'react';
import Carousel from 'react-material-ui-carousel';
import {Paper} from '@mui/material';
import {Link} from 'react-router-dom';

import image1 from '../../assets/info.jpg';
import image2 from '../../assets/topology.jpg';
import image3 from '../../assets/analysis.jpg';

const images = [
    {
        src: image1,
        caption: 'Information',
        route: '/',
    },
    {
        src: image2,
        caption: "Topology",
        route: '/topology',
    },
    {
        src: image3,
        caption: "Analysis",
        route: '/analysis',
    },
];

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
                            <div className="card">
                                <div className="detail">
                                    <div className="poster">
                                        <img src={image.src} alt={`Slide ${index + 1}`}/>
                                    </div>
                                    <Link to={image.route} className = "title">
                                        <h2>{image.caption}</h2>
                                    </Link>
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