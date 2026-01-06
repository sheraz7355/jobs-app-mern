import db from '../db/database.js';

export class Employer {
  static create({ userId, name, logo }) {
    const stmt = db.prepare('INSERT INTO employers (user_id, name, logo) VALUES (?, ?, ?)');
    const result = stmt.run(userId, name, logo);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM employers WHERE id = ?');
    return stmt.get(id);
  }

  static findByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM employers WHERE user_id = ?');
    return stmt.get(userId);
  }

  static getJobs(employerId) {
    const stmt = db.prepare('SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC');
    return stmt.all(employerId);
  }
}

