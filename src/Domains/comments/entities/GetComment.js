class GetComment {
    constructor(Payload) {
        this._verifyPayload(Payload);

        const { id, username, date, content, replies, likeCount, is_deleted } = this._mapComment(Payload);

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.replies = replies;
        this.likeCount = likeCount;
        this.is_deleted = is_deleted;
    }

    _verifyPayload({ id, username, date, content, replies, likeCount , is_deleted}) {
        if (!id || !username || !date || !content || !replies  || is_deleted === undefined) {
            throw new Error("GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof id !== "string" || typeof username !== "string" || typeof date !== "string" || typeof content !== "string" || !Array.isArray(replies) || typeof likeCount !== "number" || typeof is_deleted !== "boolean") {
            throw new Error("GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }

    _mapComment(comment) {
        return {
            ...comment,
            content: comment.is_deleted
                ? "**komentar telah dihapus**"
                : comment.content,
        };
    }
}

module.exports = GetComment;