class GetThread {
    constructor(Payload) {
        this._verifyPayload(Payload);

        const { id, title, body, date, username, comments, owner } = Payload;

        this.id = id;
        this.title = title;
        this.body = body;
        this.date = date;
        this.username = username;
        this.comments = comments;
        this.owner = owner;
    }

    _verifyPayload({ id, title, body, date, username, comments, owner }) {
        if (!id || !title || !body || !date || !username || !comments || !owner) {
            throw new Error("GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        if (typeof id !== "string" || typeof title !== "string" || typeof body !== "string" || typeof date !== "string" || typeof username !== "string" || !Array.isArray(comments) || typeof owner !== "string") {
            throw new Error("GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
        }
    }
}

module.exports = GetThread;