class GetReply {
    constructor(Payload) {
        this._verifyPayload(Payload);

        const { id, username, date, content, is_deleted } = this._mapReply(Payload);

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.is_deleted = is_deleted;
    }

    _verifyPayload({ id, username, date, content, is_deleted}) {
        if (!id || !username || !date || !content || is_deleted === undefined) {
            throw new Error("GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof id !== "string" || typeof username !== "string" || typeof date !== "string" || typeof content !== "string" || typeof is_deleted !== "boolean") {
            throw new Error("GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }

    _mapReply(reply) {
        return {
            ...reply,
            content: reply.is_deleted
                ? "**balasan telah dihapus**"
                : reply.content,
        };
    }
}

module.exports = GetReply;