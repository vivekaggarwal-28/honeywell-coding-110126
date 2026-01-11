import React from "react";
import "./IncidentList.css";

const IncidentList = ({
  incidents,
  getLocationName,
  getPriorityLabel,
  formatDateTime,
}) => {
  const getPriorityIcon = (priority) => {
    const icons = {
      1: "/img/alarm-high.svg",
      2: "/img/alarm-medium.svg",
      3: "/img/alarm-low.svg",
    };
    return icons[priority] || "/img/alarm-low.svg";
  };

  return (
    <div className="incident-list-container">
      {incidents.map((incident) => (
        <div key={incident.id} className="incident-card">
          <div className="incident-header">
            <div className="incident-title">
              <img
                src={getPriorityIcon(incident.priority)}
                alt={`${getPriorityLabel(incident.priority)} priority`}
                className="priority-icon"
              />
              <h3 className="incident-name">{incident.name}</h3>
            </div>
            <span className={`priority-badge priority-${incident.priority}`}>
              {getPriorityLabel(incident.priority)}
            </span>
          </div>

          <div className="incident-details">
            <div className="detail-item">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {formatDateTime(incident.datetime)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">
                {getLocationName(incident.locationId)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncidentList;
