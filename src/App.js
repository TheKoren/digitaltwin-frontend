import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home'
import Header from './components/header/Header'
import Network from './components/network/Network';
import Dashboard from './components/dashboard/Dashboard';
import { ScaleLoader } from 'react-spinners';


function App() {

  const [liveModel, setLiveModel] = useState(null);

  const getLiveModel = async ( ) => {
    try {

      const response = await api.get("/api/data/live");

      console.log("Received liveModel data:", response.data);
      setLiveModel(response.data);
    } catch(err) {
      console.log(err);
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveModel();
    }, 5000); //set your time here. repeat every 60 seconds
  
    return () => clearInterval(interval);
  }, [])


  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home/>}/>
        </Route>
        <Route 
            path="/topology"
            element={
              liveModel ? (
                <Network liveModel={liveModel} />
              ) : (
                <ScaleLoader color="#89cff0" />
              )
            }
          />
        <Route path="/analysis" element={<Dashboard />}>
        </Route>
        <Route path="/events">
        </Route>
      </Routes>
    </div>
  );
  
}

export default App;
