const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/users/UserRepository');
const GetThread = require("../../Domains/threads/entities/GetThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(idUser, payload) {
    const { title, body } = payload;
    const id = `thread-${this._idGenerator()}`;

    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner",
      values: [id, title, body, date, idUser],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async checkThread(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThread(threadId) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new GetThread({
      ...result.rows[0],
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
