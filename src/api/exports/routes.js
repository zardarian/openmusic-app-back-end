const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportSongsHandler,
    options: {
      auth: 'playlistapp_jwt',
    },
  },
];

module.exports = routes;
