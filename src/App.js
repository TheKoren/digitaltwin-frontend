import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import {useState, useEffect} from 'react';

function App() {

  const [sensorValues, setSensorValues] = useState();

  const getSensorValues = async () => {
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
