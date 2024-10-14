"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Job } from "@prisma/client";
import JobCard from "./JobCard";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const query = searchParams.get("query");
      const location = searchParams.get("location");
      const response = await fetch(`/api/jobs?query=${query}&location=${location}`);
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}