const GetThread = require("../GetThread");

describe("a GetThread entities", () => {
    it("should throw error when payload did not contain needed property", () => {
        const threadPayload = {
            id: "thread-123",
            title: "dicoding",
            body: "a thread",
        };

        expect(() => new GetThread(threadPayload)).toThrow(
            "GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload did not meet data type specification", () => {
        const threadPayload = {
            id: "thread-123",
            title: 123,
            body: true,
            date: "a thread",
            username: 321,
            comments: [],
        };

        expect(() => new GetThread(threadPayload)).toThrow(
            "GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should create a getThread entity correctly", () => {
        const threadPayload = {
            id: "thread-123",
            title: "thread title",
            body: "thread body",
            date: new Date().toISOString(),
            username: "dicoding",
            comments: [],
        };

        const getThread = new GetThread(threadPayload);

        expect(getThread.id).toEqual(threadPayload.id);
        expect(getThread.title).toEqual(threadPayload.title);
        expect(getThread.body).toEqual(threadPayload.body);
        expect(getThread.date).toEqual(threadPayload.date);
        expect(getThread.username).toEqual(threadPayload.username);
        expect(getThread.comments).toHaveLength(0);
    });
});