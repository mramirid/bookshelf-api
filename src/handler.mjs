import { constants } from 'http2';
import { randomUUID } from 'crypto';

import books from './books.mjs';

export function addBookHandler(request, h) {
  const reqBody = request.payload;

  if (!reqBody.name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(constants.HTTP_STATUS_BAD_REQUEST);
  }
  if (reqBody.readPage > reqBody.pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(constants.HTTP_STATUS_BAD_REQUEST);
  }

  const bookId = randomUUID();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id: bookId,
    ...reqBody,
    finished: reqBody.pageCount === reqBody.readPage,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.some((book) => book.id === bookId);
  if (!isSuccess) {
    return h
      .response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      })
      .code(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId },
    })
    .code(constants.HTTP_STATUS_CREATED);
}

export function getAllBooksHandler(request) {
  let filteredBooks = [...books];
  const { name, reading, finished } = request.query;

  if (name !== undefined && name.trim().length > 0) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  const numReading = Number.parseInt(reading, 10);
  if (!Number.isNaN(numReading)) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!numReading);
  }

  const numFinished = Number.parseInt(finished, 10);
  if (!Number.isNaN(numFinished)) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!numFinished);
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
        finished: book.finished,
        reading: book.reading,
      })),
    },
  };
}

// export function getNoteByIdHandler(request, h) {
//   const { id } = request.params;
//   const note = notes.find((item) => item.id === id);
//   if (note === undefined) {
//     return h
//       .response({
//         status: 'fail',
//         message: 'Catatan tidak ditemukan',
//       })
//       .code(constants.HTTP_STATUS_NOT_FOUND);
//   }

//   return {
//     status: 'success',
//     data: { note },
//   };
// }

// export function editNoteByIdHandler(request, h) {
//   const { id } = request.params;
//   const { title, tags, body } = request.payload;

//   const noteIndex = notes.findIndex((note) => note.id === id);
//   if (noteIndex === -1) {
//     return h
//       .response({
//         status: 'fail',
//         message: 'Gagal memperbarui catatan. Id tidak ditemukan',
//       })
//       .code(constants.HTTP_STATUS_NOT_FOUND);
//   }

//   notes[noteIndex] = {
//     ...notes[noteIndex],
//     title,
//     tags,
//     body,
//     updatedAt: new Date().toISOString(),
//   };
//   return h
//     .response({
//       status: 'success',
//       message: 'Catatan berhasil diperbarui',
//     })
//     .code(constants.HTTP_STATUS_OK);
// }

// export function deleteNoteByIdHandler(request, h) {
//   const { id } = request.params;

//   const noteIndex = notes.findIndex((note) => note.id === id);
//   if (noteIndex === -1) {
//     return h
//       .response({
//         status: 'fail',
//         message: 'Gagal memperbarui catatan. Id tidak ditemukan',
//       })
//       .code(constants.HTTP_STATUS_NOT_FOUND);
//   }

//   notes.splice(noteIndex, 1);
//   return h
//     .response({
//       status: 'success',
//       message: 'Catatan berhasil dihapus',
//     })
//     .code(constants.HTTP_STATUS_OK);
// }
