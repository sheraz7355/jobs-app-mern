import db from '../db/database.js';

export class Tag {
  static findAll() {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name');
    return stmt.all();
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    return stmt.get(id);
  }

  static findByName(name) {
    const stmt = db.prepare('SELECT * FROM tags WHERE name = ?');
    return stmt.get(name);
  }

  static findOrCreate(name) {
    let tag = this.findByName(name);
    if (!tag) {
      const stmt = db.prepare('INSERT INTO tags (name) VALUES (?)');
      const result = stmt.run(name);
      tag = this.findById(result.lastInsertRowid);
    }
    return tag;
  }

  static getJobs(tagId) {
    const stmt = db.prepare(`
      SELECT 
        j.*,
        e.name as employer_name,
        e.logo as employer_logo
      FROM jobs j
      JOIN employers e ON j.employer_id = e.id
      JOIN job_tag jt ON j.id = jt.job_id
      WHERE jt.tag_id = ?
      ORDER BY j.created_at DESC
    `);
    return stmt.all(tagId);
  }
}

