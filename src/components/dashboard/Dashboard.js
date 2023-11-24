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
    const [histogramData, setHistogramData] = useState(null);
    const [sensorExecHistogramData, setSensorExecHistogramData] = useState(null);
    const [minSensorExec, setMinSensorExec] = useState(null);
    const [maxSensorExec, setMaxSensorExec] = useState(null);


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
        updateHistogram();
        updateSensorExecHistogram();
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
            const sensorExecValues = response.data.map(dataPoint => dataPoint.wifiData.sensorExec);
            const minSensorExecValue = Math.min(...sensorExecValues);
            const maxSensorExecValue = Math.max(...sensorExecValues);
            setMinSensorExec(minSensorExecValue);
            setMaxSensorExec(maxSensorExecValue);
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
                        },
                        title: {
                            text: 'Sensor Data Chart',
                            align: 'center',
                            style: {
                                fontSize: '16px',
                                color: '#333'
                            }
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: timeStamps,
                        title: {
                            text: 'Timestamp',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Sensor Values',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
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

    const updateSensorExecHistogram = () => {
        if (deviceData) {
            const sensorExecValues = deviceData.map(dataPoint => dataPoint.wifiData.sensorExec);
            const minRange = Math.floor(minSensorExec / 100) * 100;
            const maxRange = Math.ceil(maxSensorExec / 100) * 100;

            const histogramRanges = Array.from({ length: (maxRange - minRange) / 100 + 1 }, (_, index) => [
                minRange + index * 100,
                minRange + (index + 1) * 100 - 1
            ]);
            const sensorExecHistogram = {};
            histogramRanges.forEach(range => {
                const [start, end] = range;
                const count = sensorExecValues.filter(value => value >= start && value <= end).length;
                sensorExecHistogram[`${start}-${end}`] = count;
            })
            const sensorExecHistogramChartData = {
                options: {
                    chart: {
                        background: '#f4f4f4',
                        animations: {
                            enabled: false
                        },
                        title: {
                            text: 'Sensor read execution Histogram Chart',
                            align: 'center',
                            style: {
                                fontSize: '16px',
                                color: '#333'
                            }
                        }
                    },
                    xaxis: {
                        categories: Object.keys(sensorExecHistogram),
                        title: {
                            text: 'Sensor Execution Range [ms]',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Messages',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
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
                        name: "Sensor Execution time",
                        data: Object.values(sensorExecHistogram)
                    }
                ]
            };
            setSensorExecHistogramData(sensorExecHistogramChartData);
        }
    };

    const updateHistogram = () => {
        if (deviceData) {
            const rssiValues = deviceData.map(dataPoint => dataPoint.wifiData.rssi);
            const histogram = calculateHistogram(rssiValues);
            const histogramChartData = {
                options: {
                    chart: {
                        background: '#f4f4f4',
                        animations: {
                            enabled: false
                        }
                    },
                    xaxis: {
                        categories: Object.keys(histogram),
                        title: {
                            text: 'RSSI Range [dB]',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Messages',
                            style: {
                                fontSize: '14px',
                                color: '#333'
                            }
                        }
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
                        name: "Number of Messages",
                        data: Object.values(histogram)
                    }
                ]
            };
            setHistogramData(histogramChartData);
        }
    };

    const calculateHistogram = (values) => {
        const histogram = {};
        const ranges = [
            [-99, -90],
            [-89, -80],
            [-79, -70],
            [-69, -60],
            [-59, -50],
            [-49, -40],
            [-39, -30],
            [-29, -20],
            [-19, -10],
            [-9, 0]
        ];

        ranges.forEach(range => {
            const [start, end] = range;
            const count = values.filter(value => value >= start && value <= end).length;
            histogram[`[${start.toString()}:${end.toString()}]`] = count;
        });

        return histogram;
    };

    const fetchDataAndUpdateChart = async () => {
        if (selectedDevice) {
            await getDeviceData(selectedDevice);
            updateChart();
            updateHistogram();
            updateSensorExecHistogram();
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
                        width={"50%"}
                    />
                </div>
            ) : (
                selectedDevice ?
                    <ScaleLoader color="#89cff0" /> : (
                        <p>No graph to show yet.</p>
                    )
            )}
            {histogramData && histogramData.options && histogramData.series ? (
                <div>
                    <Chart
                        options={histogramData.options}
                        series={histogramData.series}
                        type="bar"
                        width={"50%"}
                    />
                </div>
            ) : (
                <p>No histogram data available yet.</p>
            )}
            {sensorExecHistogramData && sensorExecHistogramData.options && sensorExecHistogramData.series ? (
                <div>
                    <Chart
                        options={sensorExecHistogramData.options}
                        series={sensorExecHistogramData.series}
                        type="bar"
                        width={"50%"}
                    />
                </div>
            ) : (
                <p>No sensorExec histogram data available yet.</p>
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