const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async updateCommentLike(userId, commentId) {
        const id_generated = `like-${this._idGenerator()}`;

        let query = {
            text: "SELECT id, is_liked FROM likes WHERE user_id = $1 AND comment_id = $2",
            values: [userId, commentId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length < 1) {
            const is_like = true;

            query = {
                text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
                values: [id_generated, is_like, userId, commentId],
            };
        } else {
            const { id, is_liked } = result.rows[0];
            const is_like = !is_liked;

            query = {
                text: "UPDATE likes SET is_liked = $2 WHERE id = $1",
                values: [id, is_like],
            };
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