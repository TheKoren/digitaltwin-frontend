import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home'
import Header from './components/header/Header'


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
    }, 2000); //set your time here. repeat every 5 seconds
  
    return () => clearInterval(interval);
  }, [])


  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={
              liveModel ? (
                <Home liveModel={liveModel} />
              ) : (
                <p>Loading...</p>
              )
            }
          />
        </Route>
      </Routes>
    </div>
  );
  
}

export default App;
