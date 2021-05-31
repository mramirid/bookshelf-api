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
    name: reqBody.name,
    year: reqBody.year,
    author: reqBody.author,
    summary: reqBody.summary,
    publisher: reqBody.publisher,
    pageCount: reqBody.pageCount,
    readPage: reqBody.readPage,
    reading: reqBody.reading,
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
      })),
    },
  };
}

export function getBookByIdHandler(request, h) {
  const { bookId } = request.params;

  const book = books.find((item) => item.id === bookId);
  if (book === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(constants.HTTP_STATUS_NOT_FOUND);
  }

  return {
    status: 'success',
    data: { book },
  };
}

export function editBookByIdHandler(request, h) {
  const { bookId } = request.params;
  const reqBody = request.payload;

  if (!reqBody.name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(constants.HTTP_STATUS_BAD_REQUEST);
  }
  if (reqBody.readPage > reqBody.pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(constants.HTTP_STATUS_BAD_REQUEST);
  }

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(constants.HTTP_STATUS_NOT_FOUND);
  }

  books[index] = {
    ...books[index],
    name: reqBody.name,
    year: reqBody.year,
    author: reqBody.author,
    summary: reqBody.summary,
    publisher: reqBody.publisher,
    pageCount: reqBody.pageCount,
    readPage: reqBody.readPage,
    reading: reqBody.reading,
    updatedAt: new Date().toISOString(),
  };

  return {
    status: 'success',
    message: 'Buku berhasil diperbarui',
  };
}

export function deleteBookByIdHandler(request, h) {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(constants.HTTP_STATUS_NOT_FOUND);
  }

  books.splice(index, 1);

  return {
    status: 'success',
    message: 'Buku berhasil dihapus',
  };
}
