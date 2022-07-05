const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteByIdHandler,
  },
];

module.exports = routes;
