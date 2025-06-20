/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
    async addLikes({
        id = "like-123",
        is_liked = true,
        user_id = "user-123",
        comment_id = "comment-123",
    }) {
        const query = {
            text: "INSERT INTO likes VALUES($1, $2, $3, $4)",
            values: [id, is_liked, user_id, comment_id],
        };

        await pool.query(query);
    },

    async findLikesById(idLikes) {
        const query = {
            text: "SELECT * FROM likes WHERE id = $1",
            values: [idLikes],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM likes WHERE 1=1");
    },
};

module.exports = LikesTableTestHelper;