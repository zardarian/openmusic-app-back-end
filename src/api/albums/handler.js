const config = require('../../utils/config');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._service = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    // this.postHandler = this.postHandler.bind(this);
    // this.getHandler = this.getHandler.bind(this);
    // this.getByIdHandler = this.getByIdHandler.bind(this);
    // this.putByIdHandler = this.putByIdHandler.bind(this);
    // this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
    // this.addCoverByIdHandler = this.addCoverByIdHandler.bind(this);
  }

  async postHandler(request, h) {
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
    const { id } = request.params;
    const album = await this._service.getById(id);

    if (album.coverUrl != null) {
      album.coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${album.coverUrl}`;
    }

    const response = h.response({
      status: 'success',
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  }

  async putByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  async addCoverByIdHandler(request, h) {
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
  }
}

module.exports = AlbumsHandler;
