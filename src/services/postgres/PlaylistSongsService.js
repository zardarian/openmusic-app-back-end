const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { index: indexPlaylist } = require('../../utils/model/playlists');
const { index: indexSong } = require('../../utils/model/songs');

class PlaylistSongsService {
  constructor(collaborationsService, songsService, playlistSongActivitiesService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
  }

  async add({
    playlistId, songId, userId,
  }) {
    await this._songsService.getById(songId);
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu di playlist');
    }

    await this._playlistSongActivitiesService.addActivities({
      playlistId, songId, userId, action: 'add',
    });

    return result.rows[0].id;
  }

  async get(playlistId, userId) {
    const queryValues = [playlistId, userId];
    const queryText = `
      select playlists.id, playlists.name, users.username from playlists
      left join collaborations on collaborations.playlist_id = playlists.id
      left join users on users.id = playlists.owner
      where
      playlists.id = $1
      and (playlists.owner = $2 or collaborations.user_id = $2)
    `;

    const query = {
      text: queryText,
      values: queryValues,
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist Song tidak ditemukan');
    }

    return result.rows.map(indexPlaylist)[0];
  }

  async deleteById(playlistId, songId, userId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 and song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }
    await this._playlistSongActivitiesService.addActivities({
      playlistId, songId, userId, action: 'delete',
    });
  }

  async getSongsByPlaylist(playlistId) {
    const query = {
      text: `
        select songs.id, songs.title, songs.performer from playlist_songs
        left join songs on songs.id = playlist_songs.song_id
        where playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(indexSong);
  }

  async verifyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyAccess(playlistId, userId) {
    try {
      await this.verifyOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistSongsService;
