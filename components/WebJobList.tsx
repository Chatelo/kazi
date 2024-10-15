"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface WebJob {
  title: string;
  company: string;
  location: string;
  snippet: string;
  link: string;
}

export default function WebJobList() {
  const [jobs, setJobs] = useState<WebJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchWebJobs = async () => {
      setLoading(true);
      setError(null);
      const query = searchParams.get("query");
      const location = searchParams.get("location");

      console.log("Fetching web jobs", { query, location });

      try {
        const response = await fetch(
          `/api/web-jobs?query=${encodeURIComponent(
            query || ""
          )}&location=${encodeURIComponent(location || "")}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched web jobs", data);
        setJobs(data);
      } catch (error) {
        console.error("Error fetching web jobs:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchWebJobs();
  }, [searchParams]);

  console.log("WebJobList rendering", {
    loading,
    error,
    jobsCount: jobs.length,
  });

  if (loading) {
    return <div>Loading web job results...</div>;
  }

  if (error) {
    return <div>Error: {error}. Please try again later.</div>;
  }

  if (jobs.length === 0) {
    return <div>No job results found for the given search criteria.</div>;
  }

  return (
    <div className="space-y-6">
      {jobs.map((job, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-600">{job.location}</p>
            <p className="mt-2">{job.snippet}</p>
            <Button
              className="mt-4"
              onClick={() => window.open(job.link, "_blank")}
            >
              View Job
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
