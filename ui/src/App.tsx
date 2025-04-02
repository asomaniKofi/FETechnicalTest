import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Contribution, ContributionResponse } from "./Contributions";

// Utility function to calculate contribution status
const getStatus = (startTime: string, endTime: string): string => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end < now) return "Complete";
  if (start <= now && end >= now) return "Active";
  return "Scheduled";
};

// Contribution Card Component
const Movie: React.FC<{ contribution: Contribution }> = ({ contribution }) => (
  <div className="border p-4 rounded-lg shadow-md bg-white">
    <h2 className="text-xl font-bold">{contribution.title}</h2>
    <p className="text-gray-600">{contribution.description}</p>
    <p>
      <strong>Start:</strong>{" "}
      {new Date(contribution.startTime).toLocaleString()}
    </p>
    <p>
      <strong>End:</strong> {new Date(contribution.endTime).toLocaleString()}
    </p>
    <p>
      <strong>Owner:</strong> {contribution.owner}
    </p>
    <p>
      <strong>Status:</strong>{" "}
      {getStatus(contribution.startTime, contribution.endTime)}
    </p>
  </div>
);

// Fetch Contributions from Python Server
const fetchContributions = async (): Promise<Contribution[]> => {
  try {
    const response = await axios.get<ContributionResponse>(
      "http://127.0.0.1:8000/contributions"
    );
    return response.data.contributions;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
};

// HomePage Component
const HomePage: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<
    Contribution[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasFetched, setHasFetched] = useState<boolean>(false);
  const contributionsPerPage = 14;

  useEffect(() => {
    if (!hasFetched) {
      const fetchData = async () => {
        const data = await fetchContributions();
        setContributions(data);
        setFilteredContributions(data);
        setHasFetched(true);
      };
      fetchData();
    }
  }, [hasFetched]);

  useEffect(() => {
    if (!hasFetched) {
      fetchContributions();
    }
  }, [hasFetched]);

  // Handle Search Query Change
  useEffect(() => {
    const filterContributions = () => {
      const query = searchQuery.toLowerCase();
      const filtered = contributions.filter(
        (contribution) =>
          [
            contribution.title,
            contribution.description,
            contribution.owner,
          ].some((field) => field.toLowerCase().includes(query)) ||
          getStatus(contribution.startTime, contribution.endTime)
            .toLowerCase()
            .includes(query)
      );
      setFilteredContributions(filtered);
      setCurrentPage(1); // Reset to first page when searching
    };

    filterContributions();
  }, [searchQuery, contributions]);

  // Pagination Logic
  const lastResultIndex = currentPage * contributionsPerPage;
  const firstResultIndex = lastResultIndex - contributionsPerPage;
  const currentContributions = filteredContributions.slice(
    firstResultIndex,
    lastResultIndex
  );

  // Handle Page Change
  const paginate = (pageNumber: number) => {
    if (
      pageNumber > 0 &&
      pageNumber <=
        Math.ceil(filteredContributions.length / contributionsPerPage)
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(
      filteredContributions.length / contributionsPerPage
    );
    return (
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title, description, owner, or status..."
        className="w-full p-2 border rounded-md mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Responsive Contributions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentContributions.map((contribution) => (
          <Movie key={contribution.id} contribution={contribution} />
        ))}
      </div>

      {/* Pagination */}
      {filteredContributions.length > contributionsPerPage &&
        renderPagination()}
    </div>
  );
};

export default HomePage;
