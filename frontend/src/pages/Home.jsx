import { useEffect, useState } from 'react';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import JobCardWide from '../components/JobCardWide';
import SearchForm from '../components/SearchForm';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setFeaturedJobs(response.data.featuredJobs || []);
      setJobs(response.data.jobs || []);
      setTags(response.data.tags || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-10">
      <section className="pt-6 text-center">
        <h1 className="font-bold text-4xl text-center mb-6">
          Let's Find Your Dream Job
        </h1>
        <SearchForm />
      </section>

      {featuredJobs.length > 0 && (
        <section className="pt-10">
          <h2 className="text-2xl font-bold mb-6">Featured Jobs</h2>
          <div className="grid grid-cols-3 gap-6 mt-6">
            {featuredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>
      )}

      {tags.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-5">Tags</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link
                key={tag.id}
                to={`/tags/${tag.name}`}
                className="px-3 py-1 bg-blue-900 text-blue-300 rounded text-sm hover:bg-blue-800 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-5">Recent Jobs</h2>
        <div className="mt-5 space-y-6">
          {jobs.map(job => (
            <JobCardWide key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

