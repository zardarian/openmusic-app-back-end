const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: (request, h) => handler.getHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.putByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.deleteByIdHandler(request, h),
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.addCoverByIdHandler(request, h),
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
