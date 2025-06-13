/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
    async addReplies({
        id = "reply-123",
        content = "some content",
        date = new Date().toISOString(),
        user_id = "user-123",
        comment_id = "comment-123",
        is_deleted = false,
    }) {
        const query = {
            text: "INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6)",
            values: [id, content, date, user_id, comment_id, is_deleted],
        };

        await pool.query(query);
    },

    async findRepliesById(id) {
        const query = {
            text: "SELECT * FROM replies WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM replies WHERE 1=1");
    },
};

module.exports = RepliesTableTestHelper;