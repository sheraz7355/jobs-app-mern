import db from '../db/database.js';

export class Job {
  static findAll() {
    const stmt = db.prepare(`
      SELECT 
        j.*,
        e.name as employer_name,
        e.logo as employer_logo
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      ORDER BY j.created_at DESC
    `);
    return stmt.all();
  }

  static findById(id) {
    const stmt = db.prepare(`
      SELECT 
        j.*,
        e.name as employer_name,
        e.logo as employer_logo
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE j.id = ?
    `);
    return stmt.get(id);
  }

  static create({ employerId, title, salary, location, schedule, url, featured }) {
    const stmt = db.prepare(`
      INSERT INTO jobs (employer_id, title, salary, location, schedule, url, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(employerId, title, salary, location, schedule, url, featured ? 1 : 0);
    return this.findById(result.lastInsertRowid);
  }

  static search(query) {
    const stmt = db.prepare(`
      SELECT 
        j.*,
        e.name as employer_name,
        e.logo as employer_logo
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      WHERE j.title LIKE ?
      ORDER BY j.created_at DESC
    `);
    return stmt.all(`%${query}%`);
  }

  static getTags(jobId) {
    const stmt = db.prepare(`
      SELECT t.* FROM tags t
      JOIN job_tag jt ON t.id = jt.tag_id
      WHERE jt.job_id = ?
    `);
    return stmt.all(jobId);
  }

  static addTag(jobId, tagId) {
    const stmt = db.prepare('INSERT OR IGNORE INTO job_tag (job_id, tag_id) VALUES (?, ?)');
    stmt.run(jobId, tagId);
  }
}

