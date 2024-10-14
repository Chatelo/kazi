"use client";

import { useEffect, useState } from "react";
import { JobApplication } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";

export default function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          throw new Error("Failed to fetch job applications");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch job applications",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);

  if (loading) {
    return <div>Loading job applications...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <CardTitle>{application.job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {application.job.company}
                </p>
                <p className="text-sm text-gray-600">
                  {application.job.location}
                </p>
                <p className="text-sm font-semibold mt-2">
                  Status:{" "}
                  {application.status.charAt(0).toUpperCase() +
                    application.status.slice(1)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
