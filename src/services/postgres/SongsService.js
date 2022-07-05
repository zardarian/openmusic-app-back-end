const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { index, indexById } = require('../../utils/model/songs');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async get({ title, performer }) {
    let queryText;
    let queryValues = [];
    queryText = 'SELECT * FROM songs';
    if (title || performer) {
      queryText += ' where';
      if (title && performer) {
        queryText += ' title ilike $1 and performer ilike $2';
        queryValues = [`%${title}%`, `%${performer}%`];
      } else if (title && !performer) {
        queryText += ' title ilike $1';
        queryValues = [`%${title}%`];
      } else if (!title && performer) {
        queryText += ' performer ilike $1';
        queryValues = [`%${performer}%`];
      }
    }

    const query = {
      text: queryText,
      values: queryValues,
    };
    const result = await this._pool.query(query);
    return result.rows.map(index);
  }

  async getById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(indexById)[0];
  }

  async editById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
