import React from 'react';


import "./about.css";
import image from '../../assets/digital-twin-image.png';

const imageSrc = image;

const About = () => {
    return (
      <div className="about-container">
        <div className="about-text">
          <h2>About Digital Twins</h2>
          <p>
            Digital twins are virtual representations of physical objects or systems. They are used for various purposes, including simulation, monitoring, and analysis. A digital twin is essentially a bridge between the physical and digital worlds.
          </p>
          <h3>Usages of Digital Twins</h3>
          <ul>
            <li>IoT Device Simulation</li>
            <li>Predictive Maintenance</li>
            <li>Healthcare and Medical Simulations</li>
            <li>Smart Cities and Urban Planning</li>
          </ul>
          <h3>How Digital Twins Work</h3>
          <p>
            Digital twins work by creating a real-time, virtual copy of a physical object or system. This copy is continuously updated with data from sensors and other sources. It allows for analysis, testing, and optimization without impacting the physical entity.
          </p>
        </div>
        <div className="about-image">
          <img src={imageSrc} alt="Digital Twin" />
        </div>
      </div>
    );
  };
  
  export default About;
