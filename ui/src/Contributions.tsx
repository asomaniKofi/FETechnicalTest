export interface Contribution {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  owner: string;
}

export interface ContributionResponse {
  total?: number;
  contributions: Contribution[];
  skip?: number;
  limit?: number;
}

export const getStatus = (startTime: string, endTime: string): string => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return "Upcoming";
  if (now > end) return "Ended";
  return "Ongoing";
};
