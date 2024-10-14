"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function JobSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
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
        <Button type="submit">Search Jobs</Button>
      </div>
    </form>
  );
}