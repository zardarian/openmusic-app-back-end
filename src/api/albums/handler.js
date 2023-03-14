const config = require('../../utils/config');

class AlbumsHandler {
  constructor(albumsService, storageService, userAlbumLikesService, validator) {
    this._service = albumsService;
    this._storageService = storageService;
    this._userAlbumLikesService = userAlbumLikesService;
    this._validator = validator;
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

  async likesAlbum(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.getById(albumId);
    const isLiked = await this._userAlbumLikesService.getIsLiked(userId, albumId);

    if (isLiked === false) {
      await this._userAlbumLikesService.like(userId, albumId);
    } else {
      await this._userAlbumLikesService.unlike(userId, albumId);
    }

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async countLikesAlbum(request, h) {
    const { id: albumId } = request.params;

    const countLikes = await this._userAlbumLikesService.getCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(countLikes.value, 10),
      },
    }).header('X-Data-Source', countLikes.source);
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
