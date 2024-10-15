"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

export default function JobSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [useWebSearch, setUseWebSearch] = useState(
    searchParams.get("web") === "true"
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: query,
      location: location,
      web: useWebSearch.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Job title, keywords, or company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Input
          type="text"
          placeholder="City, state, or zip code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-grow"
        />
        <div className="flex items-center">
          <Switch
            checked={useWebSearch}
            onCheckedChange={setUseWebSearch}
            id="web-search"
          />
          <label htmlFor="web-search" className="ml-2">
            Web Search
          </label>
        </div>
        <Button type="submit">Search Jobs</Button>
      </div>
    </form>
  );
}
