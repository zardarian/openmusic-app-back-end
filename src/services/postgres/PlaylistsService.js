const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { index } = require('../../utils/model/playlists');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async add({
    name, owner,
  }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async get(owner) {
    const queryValues = [owner];
    const queryText = `SELECT playlists.*, users.username FROM playlists
    left join users on users.id = playlists.owner
    left join collaborations on collaborations.playlist_id = playlists.id
    where playlists.owner = $1 or collaborations.user_id = $1
    group by playlists.id, users.username`;

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this._pool.query(query);
    return result.rows.map(index);
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistsService;
