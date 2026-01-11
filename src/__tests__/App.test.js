import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import fakeApi from "../js/fake-api";

// Mock the fake API
jest.mock("../js/fake-api");

const mockLocations = [
  { name: "Airport", id: "airport" },
  { name: "T1", id: "airport/t1" },
  { name: "T1 Lobby", id: "airport/t1/lobby" },
  { name: "T2", id: "airport/t2" },
];

const mockIncidents = [
  {
    name: "Fire",
    id: 5,
    priority: 1,
    datetime: "2018-01-22T11:25:18.000Z",
    locationId: "airport/t2",
  },
  {
    name: "Unattended Baggage",
    id: 3,
    priority: 1,
    datetime: "2018-01-22T07:13:00.000Z",
    locationId: "airport/t1",
  },
  {
    name: "Theft",
    id: 4,
    priority: 2,
    datetime: "2018-01-22T01:04:24.000Z",
    locationId: "airport/t2",
  },
  {
    name: "Liquid Spill",
    id: 1,
    priority: 3,
    datetime: "2018-01-21T22:54:12.000Z",
    locationId: "airport/t1/lobby",
  },
  {
    name: "Lost Property",
    id: 2,
    priority: 3,
    datetime: "2018-01-23T18:25:43.511Z",
    locationId: "airport/t1/lobby",
  },
];

describe("App", () => {
  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock matchMedia for responsive behavior
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 600px)" && window.innerWidth < 600,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Mock API responses
    fakeApi.getLocations.mockResolvedValue(mockLocations);
    fakeApi.getIncidentsByLocationId.mockImplementation((locationId) => {
      const locationIncidents = {
        airport: mockIncidents,
        "airport/t1": [mockIncidents[1], mockIncidents[2], mockIncidents[3]],
        "airport/t1/lobby": [mockIncidents[3], mockIncidents[4]],
        "airport/t2": [mockIncidents[0], mockIncidents[2]],
      };
      return Promise.resolve(locationIncidents[locationId] || []);
    });
  });

  test("renders header", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Incident Management System")
      ).toBeInTheDocument();
    });
  });

  test("renders incidents table on desktop view", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Fire")).toBeInTheDocument();
    });

    // Check for table headers (desktop view)
    expect(screen.getByText("Incident Name")).toBeInTheDocument();
    expect(screen.getByText("Date Time")).toBeInTheDocument();
    expect(screen.getByText("Location Name")).toBeInTheDocument();
  });

  test("renders incidents list on mobile view", async () => {
    // Mock mobile view before rendering
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Fire")).toBeInTheDocument();
    });

    // Check that table headers are NOT present (indicating mobile view)
    expect(screen.queryByText("Incident Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Date Time")).not.toBeInTheDocument();
    expect(screen.queryByText("Location Name")).not.toBeInTheDocument();
  });

  test("duplicates are filtered out", async () => {
    render(<App />);

    await waitFor(() => {
      // Should only have 5 unique incidents, not duplicates
      const fireIncidents = screen.getAllByText("Fire");
      expect(fireIncidents).toHaveLength(1);
    });
  });
});
