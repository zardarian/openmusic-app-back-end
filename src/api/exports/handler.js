const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, playlistSongsService, validator) {
    this._service = service;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;

      await this._playlistSongsService.verifyOwner(playlistId, credentialId);

      const message = {
        credentialId,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage('export:songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
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

module.exports = ExportsHandler;
