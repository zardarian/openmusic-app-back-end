const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deleteByIdHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
];

module.exports = routes;
