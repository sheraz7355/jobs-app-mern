import { Job } from '../models/Job.js';

export const searchJobs = (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const jobs = Job.search(query);
    
    // Get tags for each job
    const jobsWithTags = jobs.map(job => {
      const tags = Job.getTags(job.id);
      return { ...job, tags, featured: job.featured === 1 };
    });

    res.json({ jobs: jobsWithTags });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

