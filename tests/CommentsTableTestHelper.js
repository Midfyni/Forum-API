/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComments({ id = "comment-123", content = "a comment", date = new Date().toISOString(), user_id = "user-123", thread_id = "thread-123", is_deleted = false }) {
        const query = {
            text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)",
            values: [id, content, date, user_id, thread_id, is_deleted],
        };

        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: "SELECT * FROM comments WHERE id = $1",
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query("DELETE FROM comments WHERE 1=1");
    },
};

module.exports = CommentsTableTestHelper;