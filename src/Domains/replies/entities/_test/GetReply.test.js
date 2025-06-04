const GetReply = require("../GetReply");

describe("a GetReply entities", () => {
    it("throw error when payload did not contain needed property", () => {
        const replyPayload = {
            id: "reply-123",
            username: "dicoding",
            content: "a reply",
        };

        expect(() => new GetReply(replyPayload)).toThrow(
            "GET_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("throw error when payload did not meet data type specification", () => {
        const replyPayload = {
            id: "reply-123",
            username: 123,
            date: true,
            content: "a reply",
            replies: [],
        };

        expect(() => new GetReply(replyPayload)).toThrow(
            "GET_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("map reply content to '**balasan telah dihapus**' when reply is deleted", () => {
        const replyPayload = {
            id: "reply-123",
            content: "a reply",
            date: new Date().toISOString(),
            username: "dicoding",
            is_deleted: true,
            replies: [],
        };

        const getReply = new GetReply(replyPayload);

        expect(getReply.content).toEqual("**balasan telah dihapus**");
    });

    it("create a getReply entity correctly", () => {
        const replyPayload = {
            id: "reply-123",
            username: "dicoding",
            date: new Date().toISOString(),
            content: "a reply",
        };

        const getReply = new GetReply(replyPayload);

        expect(getReply.id).toEqual(replyPayload.id);
        expect(getReply.username).toEqual(replyPayload.username);
        expect(getReply.date).toEqual(replyPayload.date);
        expect(getReply.content).toEqual(replyPayload.content);
    });
});