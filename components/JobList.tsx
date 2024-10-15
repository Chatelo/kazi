"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Job } from "@prisma/client";
import JobCard from "./JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      const query = searchParams.get("query");
      const location = searchParams.get("location");

      try {
        const response = await fetch(
          `/api/jobs?query=${query}&location=${location}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  if (loading) {
    return <div>Loading job results...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
