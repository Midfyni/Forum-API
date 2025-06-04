const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const GetReply = require("../../Domains/replies/entities/GetReply");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(idUser, commentId, payload) {
    const conten = payload;
    const id = `reply-${this._idGenerator()}`;

    const date = new Date().toISOString();
    const isDeleted = false;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id AS owner",
      values: [id, conten, date, idUser, commentId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async availabilityReply(idReply) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [idReply],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar balasan tidak ditemukan");
    }
  }

  async verifyReplyOwner(replyId, idUser) {
    const query = {
      text: "SELECT * FROM replies WHERE user_id = $1 AND id = $2",
      values: [idUser, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("anda tidak bisa mengakses resource ini");
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1",
      values: [replyId],
    }

    await this._pool.query(query);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `SELECT replies.*, users.username FROM replies
      LEFT JOIN users ON users.id = replies.user_id
      WHERE replies.comment_id = $1 ORDER BY replies.date ASC`,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return [];
    }

    return result.rows.map(
      (reply) =>
        new GetReply({ ...reply})
    );
  }
}

module.exports = ReplyRepositoryPostgres;