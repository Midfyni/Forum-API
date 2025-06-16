const GetComment = require("../GetComment");

describe("a GetComment entities", () => {
    it("should throw error when payload did not contain needed property", () => {
        const commentPayload = {
            id: "comment-123",
            username: "dicoding",
            content: "a comment",
        };

        expect(() => new GetComment(commentPayload)).toThrow(
            "GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
        );
    });

    it("should throw error when payload did not meet data type specification", () => {
        const commentPayload = {
            id: "comment-123",
            username: 123,
            date: true,
            content: "a comment",
            replies: [],
            likeCount: [],
            is_deleted: "boolean",
        };

        expect(() => new GetComment(commentPayload)).toThrow(
            "GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
        );
    });

    it("should map comment content to '**komentar telah dihapus**' when comment is deleted", () => {
        const commentPayload = {
            id: "comment-123",
            content: "a comment",
            date: new Date().toISOString(),
            username: "dicoding",
            replies: [],
            likeCount: 0,
            is_deleted: true,
        };

        const getComment = new GetComment(commentPayload);

        expect(getComment.content).toEqual("**komentar telah dihapus**");
    });

    it("should create a getComment entity correctly", () => {
        const commentPayload = {
            id: "comment-123",
            username: "dicoding",
            date: new Date().toISOString(),
            content: "a comment",
            replies: [],
            likeCount: 0,
            is_deleted: false,
        };

        const getComment = new GetComment(commentPayload);

        expect(getComment.id).toEqual(commentPayload.id);
        expect(getComment.username).toEqual(commentPayload.username);
        expect(getComment.date).toEqual(commentPayload.date);
        expect(getComment.content).toEqual(commentPayload.content);
        expect(getComment.replies).toBeInstanceOf(Array);
        expect(getComment.replies).toHaveLength(0);
        expect(getComment.likeCount).toEqual(0);
        expect(getComment.is_deleted).toEqual(commentPayload.is_deleted);
    });
});