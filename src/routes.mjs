import { addBookHandler, getAllBooksHandler, getBookByIdHandler } from './handler.mjs';

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler,
  },
  // {
  //   method: constants.HTTP2_METHOD_PUT,
  //   path: '/books/{id}',
  //   handler: editBookByIdHandler,
  // },
  // {
  //   method: constants.HTTP2_METHOD_DELETE,
  //   path: '/books/{id}',
  //   handler: deleteBookByIdHandler,
  // },
];

export default routes;
