import React from "react";
import "./IncidentTable.css";

const IncidentTable = ({
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
    <div className="incident-table-container">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Incident Name</th>
            <th>Date Time</th>
            <th>Priority</th>
            <th>Location Name</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>
                <img
                  src={getPriorityIcon(incident.priority)}
                  alt={`${getPriorityLabel(incident.priority)} priority`}
                />
              </td>
              <td>{incident.name}</td>
              <td>{formatDateTime(incident.datetime)}</td>
              <td>
                <span
                  className={`priority-badge priority-${incident.priority}`}
                >
                  {getPriorityLabel(incident.priority)}
                </span>
              </td>
              <td>{getLocationName(incident.locationId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;
