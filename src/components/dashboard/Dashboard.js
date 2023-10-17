import React, { useState, useEffect } from 'react'
import Chart from "react-apexcharts";
import api from '../../api/axiosConfig';


const Dashboard = () => {
    const [selectedDevice, setSelectedDevice] = useState("");
    const [deviceData, setDeviceData] = useState(null);
    const [macList, setMacList] = useState(null);
    const [chartData, setChartData] = useState(null);

    const getMacList = async () => {
        try {
            const response = await api.get("/api/data/all/macs");
            console.log("All macs: ", response.data);
            setMacList(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMacList();
    }, []);

    useEffect(() => {
        updateChart();
    }, [deviceData]);

    const handleDeviceChange = (event) => {
        const selectedDeviceName = event.target.value;
        if (selectedDeviceName != "") {
            setSelectedDevice(selectedDeviceName)
            getDeviceData(selectedDeviceName)
        }
    }

    const getDeviceData = async (selectedDeviceName) => {
        try {
            const response = await api.get("/api/data/all/" + selectedDeviceName)
            console.log("Device data: ", response.data);
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
            const numberOfElements = Math.min(deviceData.length, 1000);

            for (let i = deviceData.length - numberOfElements; i < deviceData.length; i++) {
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
                        background: '#f4f4f4'
                    },
                    xaxis: {
                        categories: timeStamps
                    },
                    stroke: {
                        width: 1
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
            console.log(updatedChart);
            setChartData(updatedChart);
        }
    }


    return (
        <div className="mixed-chart">
            <h2 className="chart-title">Device Data Chart</h2>
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
                <p>Loading...</p>
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
                <p>No graph to show yet.</p>
            )}
        </div>
    );
}

export default Dashboard