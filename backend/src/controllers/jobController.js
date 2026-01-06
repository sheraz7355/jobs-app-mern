import { Job } from '../models/Job.js';
import { Tag } from '../models/Tag.js';
import { Employer } from '../models/Employer.js';

export const getJobs = (req, res) => {
  try {
    const allJobs = Job.findAll();
    
    // Get tags for each job
    const jobsWithTags = allJobs.map(job => {
      const tags = Job.getTags(job.id);
      return { ...job, tags, featured: job.featured === 1 };
    });

    // Separate featured and regular jobs
    const featuredJobs = jobsWithTags.filter(job => job.featured);
    const regularJobs = jobsWithTags.filter(job => !job.featured);

    // Get all tags
    const tags = Tag.findAll();

    res.json({
      featuredJobs,
      jobs: regularJobs,
      tags
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const createJob = (req, res) => {
  try {
    const { title, salary, location, schedule, url, featured, tags } = req.body;
    const userId = req.user.id;

    // Validation
    if (!title || !salary || !location || !schedule || !url) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (schedule !== 'Full Time' && schedule !== 'Part Time') {
      return res.status(400).json({ error: 'Schedule must be Full Time or Part Time' });
    }

    // Get employer
    const employer = Employer.findByUserId(userId);
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    // Create job
    const job = Job.create({
      employerId: employer.id,
      title,
      salary,
      location,
      schedule,
      url,
      featured: featured === true || featured === 'true'
    });

    // Add tags
    if (tags && tags.trim()) {
      const tagNames = tags.split(',').map(t => t.trim()).filter(t => t);
      tagNames.forEach(tagName => {
        const tag = Tag.findOrCreate(tagName);
        Job.addTag(job.id, tag.id);
      });
    }

    const jobTags = Job.getTags(job.id);
    const jobWithTags = { ...job, tags: jobTags, featured: job.featured === 1 };

    res.status(201).json({
      message: 'Job created successfully',
      job: jobWithTags
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
};

