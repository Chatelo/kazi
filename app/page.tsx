import JobSearch from '@/components/JobSearch';
import JobList from '@/components/JobList';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Find Your Dream Job</h1>
      <JobSearch />
      <JobList />
    </main>
  );
}