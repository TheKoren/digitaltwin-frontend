import React from 'react'
import Graph from "react-graph-vis";

import "./styles.css";
// need to import the vis network css in order to show tooltip
import "./network.css";
const Network = ({liveModel}) => {

  var currentdate = new Date();
  var datetime = "Last Sync: " +  currentdate.getFullYear() + "/"
  + (currentdate.getMonth()+1)  + "/" 
  + currentdate.getDate() + " "  
  + currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds();
  // Extract the IoT devices from the JSON data
  const devices = liveModel.map((item) => {
    return {
      id: item.mac,
      label: item.mac,
      title: `Sensor Data:\nTemperature: ${item.sensorData.temperateValue}\nHumidity: ${item.sensorData.humidityValue}\nPressure: ${item.sensorData.pressure}`,
    };
  });

  // Create the central node (Spring Boot Backend)
  const centralNode = {
    id: 'centralNode',
    label: 'Spring Boot Backend',
    title: 'Central Server node in the IoT network.',
  };

  // Create the nodes array by adding the central node and IoT devices
  const nodes = [centralNode, ...devices];

  // Create the edges array to connect nodes based on the addressList
  const edges = [];
  liveModel.forEach((item) => {
    if (item.wifiData.addressList.length > 0) {
      item.wifiData.addressList.forEach((address) => {
        edges.push({ from: item.mac, to: address });
      });
    } else {
      // Connect nodes with an empty addressList to the central node
      edges.push({ from: 'centralNode', to: item.mac });
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
    edges: {
      color: "#000000",
    },
    height: "500px",
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
      // Handle node selection here if needed
    }
  };

  return (
    <div>
      <h1>Live model based on IoT network.</h1>
      <h2>Last updated: {datetime}</h2>
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={network => {
          // If you need access to the vis.js network API, you can set the state in a parent component using this property
        }}
      />
    </div>
  );
}

export default Network;