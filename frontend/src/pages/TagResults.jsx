import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import JobCardWide from '../components/JobCardWide';

const TagResults = () => {
  const { name } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobsByTag();
  }, [name]);

  const fetchJobsByTag = async () => {
    try {
      const response = await api.get(`/tags/${name}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs by tag:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Jobs tagged: {name}</h1>
      <div className="mt-5 space-y-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCardWide key={job.id} job={job} />
          ))
        ) : (
          <p className="text-gray-400">No jobs found for tag "{name}"</p>
        )}
      </div>
    </div>
  );
};

export default TagResults;

