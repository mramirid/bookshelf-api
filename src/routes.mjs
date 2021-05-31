import { addBookHandler, getAllBooksHandler } from './handler.mjs';

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
  // {
  //   method: constants.HTTP2_METHOD_GET,
  //   path: '/notes/{id}',
  //   handler: getNoteByIdHandler,
  // },
  // {
  //   method: constants.HTTP2_METHOD_PUT,
  //   path: '/notes/{id}',
  //   handler: editNoteByIdHandler,
  // },
  // {
  //   method: constants.HTTP2_METHOD_DELETE,
  //   path: '/notes/{id}',
  //   handler: deleteNoteByIdHandler,
  // },
];

export default routes;
