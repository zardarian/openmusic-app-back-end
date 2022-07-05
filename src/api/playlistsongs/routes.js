const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deleteByIdHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
];

module.exports = routes;
