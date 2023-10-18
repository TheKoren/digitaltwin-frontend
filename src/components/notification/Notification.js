import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { ScaleLoader } from 'react-spinners';
import './notification.css'; // Import your CSS file for styling

const Notification = () => {
  const [notifications, setNotifications] = useState(null);

  const updateNotifications = async () => {
    try {
      const response = await api.get("/api/event");
      setNotifications(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (uniqueKey) => {
    try {
      await api.post("/api/event/del", uniqueKey);
      // After successful deletion, update the notifications
      updateNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    updateNotifications();

    const updateTimer = setInterval(updateNotifications, 5000);

    return () => {
      // Clear the timer when the component unmounts
      clearInterval(updateTimer);
    };
  }, []);

  return (
    <div>
      <h1>Notification</h1>
      {notifications ? (
        notifications.map((notification) => (
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
            <button onClick={() => deleteNotification(notification.uniqueKey)}>Delete</button>
          </div>
        ))
      ) : (
        <ScaleLoader color="#89cff0" />
      )}
    </div>
  );
};

export default Notification;
