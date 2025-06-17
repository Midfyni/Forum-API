const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async statusCommentLike(userId, commentId) {
        const query = {
            text: "SELECT id, is_liked FROM likes WHERE user_id = $1 AND comment_id = $2",
            values: [userId, commentId],
        };

        const result = await this._pool.query(query);

        return result.rows[0];
    }

    async createCommentLike(userId, commentId) {
        const id_generated = `like-${this._idGenerator()}`;

        const is_like = true;

        const query = {
            text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
            values: [id_generated, is_like, userId, commentId],
        };

        await this._pool.query(query);
    }

    async updateCommentLike(id, is_like) {
        const query = {
            text: "UPDATE likes SET is_liked = $2 WHERE id = $1",
            values: [id, is_like],
        };

        const hasil = await this._pool.query(query);
    }

    async countCommentLikes(commentId) {
        const query = {
            text: `
            SELECT * 
            FROM likes 
            WHERE comment_id = $1 AND is_liked = true
        `,
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows.length;
    }
}

module.exports = LikeRepositoryPostgres;