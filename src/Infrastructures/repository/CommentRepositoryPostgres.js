const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const GetThread = require("../../Domains/threads/entities/GetThread");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(idUser, idThread, payload) {
    const content = payload.content;
    const id = `comment-${this._idGenerator()}`;

    const date = new Date().toISOString();
    const isDeleted = false;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id AS owner",
      values: [id, content, date, idUser, idThread, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }
}

module.exports = CommentRepositoryPostgres;
