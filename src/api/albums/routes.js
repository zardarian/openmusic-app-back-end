const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: handler.getHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteByIdHandler,
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.addCoverByIdHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
];

module.exports = routes;
