import React from 'react';
import Hero from '../hero/Hero';
import Network from '../network/Network';

const Home = ({liveModel}) => {
    return (
        <div>
            <Hero/>
            {liveModel ? (
                <Network liveModel={liveModel}/>
            ) : (
                <p>Loading...</p>
            )}
        </div>
        
    )
}

export default Home;