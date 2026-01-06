import { Tag } from '../models/Tag.js';
import { Job } from '../models/Job.js';

export const getJobsByTag = (req, res) => {
  try {
    const { name } = req.params;

    const tag = Tag.findByName(name);
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const jobs = Tag.getJobs(tag.id);
    
    // Get tags for each job
    const jobsWithTags = jobs.map(job => {
      const tags = Job.getTags(job.id);
      return { ...job, tags, featured: job.featured === 1 };
    });

    res.json({ jobs: jobsWithTags });
  } catch (error) {
    console.error('Error fetching jobs by tag:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

