const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService, storageService, userAlbumLikesService, validator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      albumsService, storageService, userAlbumLikesService, validator,
    );
    server.route(routes(albumsHandler));
  },
};
