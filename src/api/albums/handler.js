const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._service = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getHandler = this.getHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.putByIdHandler = this.putByIdHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
    this.addCoverByIdHandler = this.addCoverByIdHandler.bind(this);
  }

  async postHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.add({ name, year });

      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
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

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getHandler() {
    const albums = await this._service.get();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getById(id);

      if (album.coverUrl != null) {
        album.coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${album.coverUrl}`;
      }

      return {
        status: 'success',
        data: {
          album,
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

  async putByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;

      await this._service.editById(id, request.payload);

      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
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

  async deleteByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deleteById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
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

  async addCoverByIdHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;
      this._validator.validateAlbumCoverHeader(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      await this._service.addCoverById(id, filename);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
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

module.exports = AlbumsHandler;
