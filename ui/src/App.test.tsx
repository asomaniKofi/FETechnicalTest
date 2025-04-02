import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
const axios = require("axios");
import HomePage from "./App";
import { Contribution } from "./Contributions";
import "@testing-library/jest-dom";
// Mock Axios
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  mockResolvedValue: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HomePage Component", () => {
  const mockContributions: Contribution[] = Array.from(
    { length: 31 },
    (_, i) => ({
      id: i + 1,
      title: `Contribution ${i + 1}`,
      description: `Description ${i + 1}`,
      startTime: "2025-04-01T10:00:00Z",
      endTime: "2025-04-01T12:00:00Z",
      owner: `Owner ${i + 1}`,
    })
  );

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: { contributions: mockContributions },
    });
  });

  it("should render the HomePage and fetch contributions", async () => {
    // Redefining the MutationObserver constructor
    if (typeof window.MutationObserver !== "undefined") {
      console.warn("MutationObserver has already been defined.");
    } else {
      // Define the MutationObserver constructor
      var MutationObserver = function () {
        // Custom constructor code
      };
    }

    render(<HomePage />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/contributions"
      );

      // Check if contributions are rendered
      expect(screen.getByText("Contribution 1")).toBeInTheDocument();
      expect(screen.getByText("Contribution 2")).toBeInTheDocument();
    });
  });

  it("should allow the user to search contributions", async () => {
    render(<HomePage />);

    await waitFor(async () =>
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/contributions"
      )
    );

    const searchInput = screen.getByPlaceholderText(
      "Search by title, description, owner, or status..."
    );
    fireEvent.change(searchInput, { target: { value: "Contribution 1" } });

    expect(screen.getByText("Contribution 1")).toBeInTheDocument();
    expect(screen.queryByText("Contribution 2")).toBeNull(); // Contribution 2 should not be rendered
  });

  it("should paginate contributions", async () => {
    render(<HomePage />);

    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/contributions"
      );
      // Check if first page contributions are rendered
      expect(screen.getByText("Contribution 1")).toBeInTheDocument();
      expect(screen.queryByText("Contribution 15")).toBeNull();

      fireEvent.click(screen.getByText("2"));

      // Check if second page contributions are rendered
      expect(screen.getByText("Contribution 15")).toBeInTheDocument();
      expect(screen.queryByText("Contribution 1")).toBeNull();
    });

    // // Click to navigate to next page
  });
});
