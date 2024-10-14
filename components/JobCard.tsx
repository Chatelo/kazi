"use client";

import { Job } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const { toast } = useToast();

  const handleSaveJob = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to save jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (response.ok) {
        setIsSaved(true);
        toast({
          title: "Success",
          description: "Job saved successfully",
        });
      } else {
        throw new Error("Failed to save job");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    }
  };

  const handleApplyJob = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: job.id }),
      });

      if (response.ok) {
        setIsApplied(true);
        toast({
          title: "Success",
          description: "Application submitted successfully",
        });
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{job.company}</p>
        <p className="text-sm text-gray-600">{job.location}</p>
        <p className="mt-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSaveJob} disabled={isSaved}>
          {isSaved ? "Saved" : "Save Job"}
        </Button>
        <Button onClick={handleApplyJob} disabled={isApplied}>
          {isApplied ? "Applied" : "Apply Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
