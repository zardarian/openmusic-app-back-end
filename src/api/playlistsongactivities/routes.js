const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
];

module.exports = routes;
