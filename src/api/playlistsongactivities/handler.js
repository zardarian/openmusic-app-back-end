const ClientError = require('../../exceptions/ClientError');

class PlaylistSongActivitiesHandler {
  constructor(service) {
    this._service = service;

    this.getHandler = this.getHandler.bind(this);
  }

  async getHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyAccess(playlistId, credentialId);
      const playlistSongActivities = await this._service.getActivities(playlistId);

      return {
        status: 'success',
        data: {
          playlistId, activities: playlistSongActivities,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongActivitiesHandler;
