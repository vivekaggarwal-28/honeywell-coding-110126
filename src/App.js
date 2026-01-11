import React, { useState, useEffect } from "react";
import IncidentTable from "./components/IncidentTable";
import IncidentList from "./components/IncidentList";
import fakeApi from "./js/fake-api";
import "./App.css";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const locationsData = await fakeApi.getLocations();
        setLocations(locationsData);

        const allIncidentsPromises = locationsData.map((location) =>
          fakeApi.getIncidentsByLocationId(location.id)
        );

        const incidentsArrays = await Promise.all(allIncidentsPromises);
        const allIncidents = incidentsArrays.flat();

        const uniqueIncidents = allIncidents.filter(
          (incident, index, self) =>
            index === self.findIndex((i) => i.id === incident.id)
        );

        const sortedIncidents = uniqueIncidents.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return new Date(b.datetime) - new Date(a.datetime);
        });

        setIncidents(sortedIncidents);
      } catch (err) {
        setError("Failed to load incidents. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLocationName = (locationId) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location ? location.name : "Unknown";
  };

  const getPriorityLabel = (priority) => {
    const labels = { 1: "High", 2: "Medium", 3: "Low" };
    return labels[priority] || "Unknown";
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div className="loading">Loading incidents...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>Incident Management System</h1>
        </div>
        {isMobile ? (
          <IncidentList
            incidents={incidents}
            getLocationName={getLocationName}
            getPriorityLabel={getPriorityLabel}
            formatDateTime={formatDateTime}
          />
        ) : (
          <IncidentTable
            incidents={incidents}
            getLocationName={getLocationName}
            getPriorityLabel={getPriorityLabel}
            formatDateTime={formatDateTime}
          />
        )}
      </div>
    </div>
  );
}

export default App;
