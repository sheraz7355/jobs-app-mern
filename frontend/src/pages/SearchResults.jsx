import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import JobCardWide from '../components/JobCardWide';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      <div className="mt-5 space-y-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCardWide key={job.id} job={job} />
          ))
        ) : (
          <p className="text-gray-400">No jobs found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

