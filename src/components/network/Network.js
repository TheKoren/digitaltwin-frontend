import Graph from "react-graph-vis";
import {useState, useEffect} from 'react';
import imageSrc1 from '../../assets/esp32.png';
import imageSrc2 from '../../assets/spring.png';

import "./styles.css";
// need to import the vis network css in order to show tooltip
import "./network.css";
const Network = ({liveModel}) => {


  const[currentDate, setCurrentDate] = useState(new Date());

  var datetime = "Last Sync: " +  currentDate.getFullYear() + "/"
  + (currentDate.getMonth()+1)  + "/" 
  + currentDate.getDate() + " "  
  + currentDate.getHours() + ":"  
  + currentDate.getMinutes() + ":" 
  + currentDate.getSeconds();
  // Extract the IoT devices from the JSON data
  const devices = liveModel.map((item) => {
    return {
      id: item.mac,
      label: item.mac,
      title: `Data\nTemperature: ${item.sensorData.temperateValue} °C\nHumidity: ${item.sensorData.humidityValue}%\nPressure: ${item.sensorData.pressure} Pa\n` + 
             `CO2: ${item.sensorData.eco2}ppm\nTVOC: ${item.sensorData.tvocValue}ppb\nSound: ${item.sensorData.sound} dB\nLight: ${item.sensorData.light} lx\nUV: ${item.sensorData.uv}\n` +
             `RSSI: ${item.wifiData.rssi}dB\nTxPower: ${item.wifiData.txPower} dBm\nChannel: ${item.wifiData.channel}`,
      shape: 'circularImage',
      image: imageSrc1
    };
  });

  // Create the central node (Spring Boot Backend)
  const centralNode = {
    id: 'centralNode',
    label: 'Spring Boot Backend',
    title: 'Central Server node in the IoT network.',
    shape: 'circularImage',
    image: imageSrc2
  };

  // Create the nodes array by adding the central node and IoT devices
  const nodes = [centralNode, ...devices];

  // Create the edges array to connect nodes based on the addressList
  const edges = [];
  liveModel.forEach((item) => {
    if (item.wifiData.addressList) {
      edges.push({ from: 'centralNode', to: item.mac });
      item.wifiData.addressList.forEach((address) => {
        edges.push({ from: item.mac, to: String(address).toUpperCase() });
      });
    }
  });

  const graph = {
    nodes: nodes,
    edges: edges,
  };
  const options = {
    layout: {
      hierarchical: true,
    },
    nodes: {
      borderWidth: 1,
      borderWidthSelected: 4,
      size: 50,
      color: {
        border: '#2B7CE9',
        background: 'white',
        highlight: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        },
        hover: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        }
      },
      opacity: 1,
      fixed: {
        x:false,
        y:false
      },
      font: {
        color: '#343434',
        size: 14, // px
        face: 'arial',
        background: 'none',
        strokeWidth: 0, // px
        strokeColor: '#ffffff',
        align: 'center',
        multi: false,
        vadjust: 0,
        bold: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'bold'
        },
        ital: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'italic',
        },
        boldital: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          vadjust: 0,
          mod: 'bold italic'
        },
        mono: {
          color: '#343434',
          size: 15, // px
          face: 'courier new',
          vadjust: 2,
          mod: ''
        }
      },
    },
    edges: {
      color: "black",
    },
    height: "500px",
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
      // Handle node selection here if needed
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date);
    }, 2000);
  
    return () => clearInterval(interval);
  })
  return (
    <div className="network-container">
      <h1 className="network-title">Live model based on IoT network</h1>
      <div className="network-info">
        <p className="network-info-item">Last updated: {datetime}</p>
        <p className="network-info-item">Number of devices: {liveModel.length}</p>
      </div>
      <Graph graph={graph} options={options} events={events} />
    </div>
  );
}

export default Network;