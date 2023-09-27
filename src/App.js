import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';
import Layout from './components/Layout';
import {Routes, Route} from 'react-router-dom';
import Home from './components/home/Home'
import Header from './components/header/Header'

function App() {

  const [sensorValues, setSensorValues] = useState();

  const getSensorValues = async ( ) => {
    try {

      const response = await api.get("/api/data");

      console.log(response.data);

      setSensorValues(response.data);

    } catch(err) {
      console.log(err);
    }

  }

  useEffect(() => {
    getSensorValues();
  }, [])


  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/" element={<Home/>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
