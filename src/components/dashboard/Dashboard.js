import React, { useState, useEffect } from 'react'
import Chart from "react-apexcharts";
import api from '../../api/axiosConfig';
import { ScaleLoader } from 'react-spinners';


const Dashboard = () => {
    const [selectedDevice, setSelectedDevice] = useState("");
    const [deviceData, setDeviceData] = useState(null);
    const [macList, setMacList] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [numberOfElements, setNumberOfElements] = useState(100);
    const [showWarning, setShowWarning] = useState(false);
    const [clusters, setClusters] = useState(null);


    const handleNumberOfElementsChange = (event) => {
        const newValue = event.target.value;
        setNumberOfElements(newValue);
        setShowWarning(newValue > 1000);
    };

    const getMacList = async () => {
        try {
            const response = await api.get("/api/data/all/macs");
            setMacList(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getClusters = async () => {
        try {
            const response = await api.get("/api/data/cluster");
            console.log(response);
            setClusters(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getMacList();
        getClusters();
    }, []);

    useEffect(() => {
        updateChart();
    }, [deviceData, numberOfElements]);

    const handleDeviceChange = (event) => {
        const selectedDeviceName = event.target.value;
        if (selectedDeviceName != "") {
            setSelectedDevice(selectedDeviceName)
            getDeviceData(selectedDeviceName)
        }
    }

    const getDeviceData = async (selectedDeviceName) => {
        try {
            const response = await api.get("/api/data/all/" + selectedDeviceName + "/" + numberOfElements)
            console.log(response)
            setDeviceData(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const updateChart = () => {
        if (deviceData) {
            const timeStamps = [];
            const temperatureValues = [];
            const humidityValues = [];
            const pressureValues = [];
            const eco2Values = [];
            const tvocValues = [];
            const soundValues = [];
            const lightValues = [];
            const uvValues = [];
            const elementNumber = Math.min(deviceData.length, numberOfElements);

            for (let i = deviceData.length - elementNumber; i < deviceData.length; i++) {
                const dataPoint = deviceData[i];
                timeStamps.push(dataPoint.timestamp);
                temperatureValues.push(dataPoint.sensorData.temperatureValue);
                humidityValues.push(dataPoint.sensorData.humidityValue);
                pressureValues.push(dataPoint.sensorData.pressure);
                eco2Values.push(dataPoint.sensorData.eco2);
                tvocValues.push(dataPoint.sensorData.tvocValue);
                soundValues.push(dataPoint.sensorData.sound);
                lightValues.push(dataPoint.sensorData.light);
                uvValues.push(dataPoint.sensorData.uv);
            }
            const updatedChart = {
                options: {
                    chart: {
                        background: '#f4f4f4',
                        animations: {
                            enabled: false
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: timeStamps
                    },
                    stroke: {
                        width: 1
                    },
                    markers: {
                        size: 0
                    }
                },
                series: [
                    {
                        name: "temperature",
                        data: temperatureValues
                    },
                    {
                        name: "humidity",
                        data: humidityValues
                    },
                    {
                        name: "pressure",
                        data: pressureValues
                    },
                    {
                        name: "eco2",
                        data: eco2Values
                    },
                    {
                        name: "tvoc",
                        data: tvocValues
                    },
                    {
                        name: "sound",
                        data: soundValues
                    },
                    {
                        name: "light",
                        data: lightValues
                    },
                    {
                        name: "uv",
                        data: uvValues
                    }
                ]
            };
            setChartData(updatedChart);
        }
    }

    const fetchDataAndUpdateChart = async () => {
        if (selectedDevice) {
            await getDeviceData(selectedDevice);
            updateChart();
        }
    }

    useEffect(() => {
        // Update the chart automatically every N seconds (e.g., every 30 seconds)
        const interval = setInterval(fetchDataAndUpdateChart, 30000); // Change the interval as needed

        // Perform the initial fetch and update
        fetchDataAndUpdateChart();

        // Cleanup the interval on unmount
        return () => clearInterval(interval);
    }, [selectedDevice]); // Update chart when selectedDevice changes


    return (
        <div className="mixed-chart">
            <h2 className="chart-title">Device Data Chart</h2>
            <div>
                <label htmlFor="numberOfElements">Number of Elements: {numberOfElements}</label>
                <input
                    type="range"
                    id="numberOfElements"
                    name="numberOfElements"
                    min="100"
                    max="5000"
                    step="100"
                    value={numberOfElements}
                    onChange={handleNumberOfElementsChange}
                />
                {showWarning && (
                    <div className="warning">
                        <span className="warning-text">
                            Warning: Scaling above 1000 may cause performance issues.
                        </span>
                        <span className="warning-sign">⚠️</span>
                    </div>
                )}
            </div>
            {macList ? (
                <select value={selectedDevice} onChange={handleDeviceChange}>
                    <option value="">Select a Device</option>
                    {macList.map((mac) => (
                        <option key={mac} value={mac}>
                            {mac}
                        </option>
                    ))}
                </select>
            ) : (
                <ScaleLoader color="#89cff0" />
            )}
            {chartData && chartData.options && chartData.series ? (
                <div>
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        width={"70%"}
                    />
                </div>
            ) : (
                selectedDevice ?
                    <ScaleLoader color="#89cff0" /> : (
                        <p>No graph to show yet.</p>
                    )
            )}
             {clusters ? (
                        <div className="cluster-info">
                            <h2>Cluster Information</h2>
                            <h6>Result of similarity check. Those devices that have similar measurement data are considered to be in the same cluster.</h6>
                            {clusters.map((cluster, index) => (
                                <div key={index}>
                                    <p>{`${index + 1}# Cluster:`}</p>
                                    <ul>
                                        {cluster.map((item, itemIndex) => (
                                            <li key={itemIndex}>ESP32 device mac address: {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Not enough data gathered yet to determine clusters.</p>
                    )}
        </div>
    );
}

export default Dashboard