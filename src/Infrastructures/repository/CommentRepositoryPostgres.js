const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const GetThread = require("../../Domains/threads/entities/GetThread");
const GetComment = require("../../Domains/comments/entities/GetComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(idUser, idThread, payload) {
    const conten = payload;
    const id = `comment-${this._idGenerator()}`;

    const date = new Date().toISOString();
    const isDeleted = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id AS owner",
      values: [id, conten, date, idUser, idThread, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async availabilityComment(idComment) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [idComment],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komen tidak ditemukan");
    }
  }

  async verifyCommentOwner(commentId, idUser) {
    const query = {
      text: "SELECT * FROM comments WHERE user_id = $1 AND id = $2",
      values: [idUser, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("anda tidak bisa mengakses resource ini");
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: "UPDATE comments SET is_deleted = true WHERE id = $1",
      values: [commentId],
    }

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments
      LEFT JOIN users ON users.id = comments.user_id
      WHERE comments.thread_id = $1 ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map(
      (comment) =>
        new GetComment({
          ...comment,
          replies: [],
        })
    );
  }
}

module.exports = CommentRepositoryPostgres;
