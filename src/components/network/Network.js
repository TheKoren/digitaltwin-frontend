import Graph from "react-graph-vis";
import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import imageSrc1 from '../../assets/esp32.png';
import imageSrc2 from '../../assets/spring.png';
import imageSrc3 from '../../assets/esp8266.jpg'
import { ScaleLoader } from 'react-spinners';


import "./styles.css";
// need to import the vis network css in order to show tooltip
import "./network.css";
const Network = ({ liveModel }) => {

  const [monitorData, setMonitorData] = useState(null);
  const [currentDevice, setCurrentDevice] = useState("");
  const [reconnecting, setReconnecting] = useState(false);
  const [lightControlling, setLightControlling] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  var datetime = "Last Sync: " + currentDate.getFullYear() + "/"
    + (currentDate.getMonth() + 1) + "/"
    + currentDate.getDate() + " "
    + currentDate.getHours() + ":"
    + currentDate.getMinutes() + ":"
    + currentDate.getSeconds();
  // Extract the IoT devices from the JSON data
  const devices = liveModel.map((item) => {
    return {
      id: item.mac,
      label: item.mac,
      title: `Data\nTemperature: ${item.sensorData.temperatureValue} °C\nHumidity: ${item.sensorData.humidityValue}%\nPressure: ${item.sensorData.pressure} Pa\n` +
        `CO2: ${item.sensorData.eco2}ppm\nTVOC: ${item.sensorData.tvocValue}ppb\nSound: ${item.sensorData.sound} dB\nLight: ${item.sensorData.light} lx\nUV: ${item.sensorData.uv}\n` +
        `RSSI: ${item.wifiData.rssi}dB\nTxPower: ${item.wifiData.txPower} dBm\nChannel: ${item.wifiData.channel}\nSensorRead: ${item.wifiData.sensorRead}ms\nSensorExec: ${item.wifiData.sensorExec}ms`,
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

  const monitorNode = {
    id: 'monitorNode',
    label: monitorData?.mac,
    title: `ESP8266 Monitor node`,
    shape: 'circularImage',
    image: imageSrc3
  }

  // Create the nodes array by adding the central node and IoT devices
  const nodes = [centralNode, monitorNode, ...devices];

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
        x: false,
        y: false
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
    select: function (event) {
      var { nodes, edges } = event;
      if (nodes.length === 1) {
        const selectedDevice = nodes[0];
        if (selectedDevice !== 'monitorNode' && selectedDevice !== 'centralNode') {
          setCurrentDevice(selectedDevice);
        }
      }
    }
  };

  const handleReconnectWiFi = async () => {
    if (currentDevice) {
      setReconnecting(true);
      try {
        await api.post("/api/control/reconnect", currentDevice)
      } catch (error) {
        console.error(error);
      } finally {
        setReconnecting(false);
      }
    }
  };

  const handleLightControl = async () => {
    if (currentDevice) {
      setLightControlling(true);
      try {
        await api.post("/api/control/light", currentDevice)
      } catch (error) {
        console.error(error);
      } finally {
        setLightControlling(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date);
    }, 2000);

    return () => clearInterval(interval);
  })

  useEffect(() => {
    const fetchMonitorData = async () => {
      try {
        const response = await api.get("/api/data/monitor")
        setMonitorData(response.data);
      }
      catch (e) {
        console.error(e);
      }
    }
    fetchMonitorData();
  }, [])
  return (
    <div className="network-container">
      <h1 className="network-title">Live model based on IoT network</h1>
      <div className="network-info">
        <p className="network-info-item">Last updated: {datetime}</p>
        <p className="network-info-item">Number of devices in Wi-Fi hierarchy: {liveModel.length}</p>
      </div>
      <Graph graph={graph} options={options} events={events} />
      <div className="device-controls">
        <h4>Device Controls</h4>
        <select value={currentDevice} onChange={(e) => setCurrentDevice(e.target.value)}>
          <option value="">Select Device</option>
          {liveModel.map((device) => (
            <option key={device.mac} value={device.mac}>
              {device.mac}
            </option>
          ))}
        </select>
        <button onClick={handleReconnectWiFi} disabled={!currentDevice || reconnecting || (liveModel.find((device) => device.mac === currentDevice)?.wifiData.mode === "AP_STA")}>
          {reconnecting ? "Reconnecting..." : "Reconnect Wi-Fi"}
        </button>
        <button onClick={handleLightControl} disabled={!currentDevice || lightControlling}>
          {lightControlling ? "LightControlling..." : "Control light"}
        </button>
      </div>
      <div className="network-monitor">
        {monitorData ? (
          <div className="table-container">
            <h4>Monitor node contents</h4>
            <pre>Mac: {monitorData.mac}</pre>
            <table style={{ borderCollapse: 'collapse', width: '80%', margin: 'auto', border: '1px solid black' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid black' }}>SSID</th>
                  <th style={{ padding: '10px', border: '1px solid black' }}>RSSI</th>
                  <th style={{ padding: '10px', border: '1px solid black' }}>Channel</th>
                </tr>
              </thead>
              <tbody>
                {monitorData.networksList.map((network, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid black', fontWeight: network.ssid === 'Koren' || network.ssid === 'ESP32' ? 'bold' : 'normal' }}>
                      {network.ssid}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid black', fontWeight: network.ssid === 'Koren' || network.ssid === 'ESP32' ? 'bold' : 'normal' }}>
                      {network.rssi}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid black', fontWeight: network.ssid === 'Koren' || network.ssid === 'ESP32' ? 'bold' : 'normal' }}>
                      {network.channel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <pre>Last update: {monitorData.timestamp}</pre>
          </div>
        ) : (
          <ScaleLoader color="#89cff0" />)}
      </div>
    </div>
  );
}

export default Network;