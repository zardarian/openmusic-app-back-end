const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getIsLiked(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 and album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return false;
    }

    return true;
  }

  async like(userId, albumId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`user-album-likes:${albumId}`);
    return result.rows[0].id;
  }

  async unlike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 and album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menyukai album');
    }

    await this._cacheService.delete(`user-album-likes:${albumId}`);
    return result.rows[0].id;
  }

  async getCount(albumId) {
    try {
      const result = await this._cacheService.get(`user-album-likes:${albumId}`);
      const output = { source: 'cache', value: result };
      return output;
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(id) from user_album_likes where album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const output = { source: 'database', value: result.rows[0].count };
      await this._cacheService.set(`user-album-likes:${albumId}`, result.rows[0].count);

      return output;
    }
  }
}

module.exports = UserAlbumLikesService;
