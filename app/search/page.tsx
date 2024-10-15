import { Suspense } from "react";
import JobSearch from "@/components/JobSearch";
import JobList from "@/components/JobList";
import WebJobList from "@/components/WebJobList";

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams: { query: string; location: string; web: string };
}) {
  const useWebSearch = searchParams.web === "true";

  console.log("SearchResultsPage rendered", { searchParams, useWebSearch });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Job Search Results
      </h1>
      <JobSearch />
      <Suspense fallback={<div>Loading...</div>}>
        {useWebSearch ? <WebJobList /> : <JobList />}
      </Suspense>
    </main>
  );
}
