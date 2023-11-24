import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import api from '../../api/axiosConfig';
import { ScaleLoader } from 'react-spinners';
import './notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [macList, setMacList] = useState([]);
  const [selectedMac, setSelectedMac] = useState('');
  const [showCrash, setShowCrash] = useState(true);
  const [showDrop, setShowDrop] = useState(true);
  const [showChange, setShowChange] = useState(true);
  const [showThreshold, setShowThreshold] = useState(true);
  const [chartData, setChartData] = useState({});


  const fetchNotifications = async () => {
    try {
      var crashNotifications = []
      var dropNotifications = []
      var modelChangeNotifications = []
      var thresholdNotifications = []
      if (showChange) {
        const crashResponse = await api.get("/api/event/crash/" + selectedMac);
        crashNotifications = crashResponse.data;
      }
      if (showDrop) {
        const dropResponse = await api.get(`/api/event/drop/${selectedMac}`);
        dropNotifications = dropResponse.data;
      }
      if (showChange) {
        const modelChangeResponse = await api.get(`/api/event/modelchange/${selectedMac}`);
        modelChangeNotifications = modelChangeResponse.data;
      }
      if (showThreshold) {
        const thresholdResponse = await api.get(`/api/event/threshold/${selectedMac}`);
        thresholdNotifications = thresholdResponse.data;
      }

      var temp = [...crashNotifications, ...dropNotifications, ...modelChangeNotifications, ...thresholdNotifications]
      setNotifications(temp);
      console.log(temp)

      const typeCounts = temp.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        options: {
          xaxis: {
            categories: Object.keys(typeCounts)
          },
          labels: Object.keys(typeCounts)

        },
        series: Object.values(typeCounts),
      };

      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMacList = async () => {
    try {
      const response = await api.get("/api/data/all/macs");
      setMacList(response.data);
    } catch (err) {
      console.error("Error fetching Mac list:", err);
    }
  };

  const deleteNotification = async (uniqueKey) => {
    try {
      await api.post("/api/event/del", uniqueKey);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMacChange = (event) => {
    const selectedMac = event.target.value;
    setSelectedMac(selectedMac);
  };

  useEffect(() => {
    getMacList();
  }, []);

  useEffect(() => {
    fetchNotifications()
  }, [selectedMac, showCrash, showDrop, showThreshold, showChange])

  const handleToggleVisibility = (type) => {
    // Update the visibility state based on the button type
    if (type === 'CRASH') {
      setShowCrash(!showCrash);
    } else if (type === 'DROP') {
      setShowDrop(!showDrop);
    } else if (type === 'CHANGE') {
      setShowChange(!showChange);
    } else if (type === 'THRESHOLD') {
      setShowThreshold(!showThreshold)
    }
  };

  return (
    <div>
      <h1>Notification</h1>
      <div>
        <label>Select MAC:</label>
        <select value={selectedMac} onChange={handleMacChange}>
          <option value='' disabled>Select MAC</option>
          {macList.map((mac) => (
            <option key={mac} value={mac}>
              {mac}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <ScaleLoader color="#89cff0" />
      ) : (
        notifications && (
          <div>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="donut"
              width={"20%"}
            />
          </div>
        )
      )}
      <div>
        {selectedMac != '' ? (
          <div>
            <button onClick={() => handleToggleVisibility('CRASH')}>
              {showCrash ? 'Hide Crash' : 'Show Crash'}
            </button>
            <button onClick={() => handleToggleVisibility('DROP')}>
              {showDrop ? 'Hide Drop' : 'Show Drop'}
            </button>
            <button onClick={() => handleToggleVisibility('CHANGE')}>
              {showChange ? 'Hide Change' : 'Show Change'}
            </button>
            <button onClick={() => handleToggleVisibility('THRESHOLD')}>
              {showThreshold ? 'Hide Threshold' : 'Show Threshold'}
            </button>
          </div>
        ) : (<p></p>)}

      </div>
      {loading ? (
        <ScaleLoader color="#89cff0" />
      ) : (
        notifications && notifications.map((notification) => (
          <div key={notification.uniqueKey} className={`notification ${notification.type}`}>
            <div className="bold-text">Type: </div>
            <div>{notification.type}</div>
            <div className="bold-text">Message: {notification.message}</div>
            <div>{notification.message}</div>
            {notification.parent && (
              <div className="parent">
                <div className="parent bold-text">Related message:</div>
                <div>Timestamp: {notification.parent.timestamp}. MAC: {notification.parent.mac}</div>
              </div>
            )}
            {notification.measurementValueType && (
              <div className="bold-text">Related sensor data: {notification.measurementValueType}</div>
            )}
            {notification.newValue && (
              <div className="bold-text">Value change: from {notification.oldValue} to {notification.newValue}</div>
            )}
            {notification.difference && (
              <div className="bold-text">Difference was: {notification.difference}</div>
            )}
            {notification.apNode && (
              <div className="bold-text">AP node was: {notification.apNode.mac}</div>
            )}
            <button onClick={() => deleteNotification(notification.uniqueKey)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
