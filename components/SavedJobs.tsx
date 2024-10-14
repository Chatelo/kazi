"use client";

import { useEffect, useState } from "react";
import { SavedJob } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await fetch("/api/saved-jobs");
        if (response.ok) {
          const data = await response.json();
          setSavedJobs(data);
        } else {
          throw new Error("Failed to fetch saved jobs");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch saved jobs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [toast]);

  if (loading) {
    return <div>Loading saved jobs...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
      {savedJobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((savedJob) => (
            <Card key={savedJob.id}>
              <CardHeader>
                <CardTitle>{savedJob.job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{savedJob.job.company}</p>
                <p className="text-sm text-gray-600">{savedJob.job.location}</p>
                <Button
                  className="mt-2"
                  onClick={() => window.open(savedJob.job.url, "_blank")}
                >
                  View Job
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
