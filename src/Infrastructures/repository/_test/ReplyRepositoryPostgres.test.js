const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const pool = require("../../../Infrastructures/database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const GetReply = require("../../../Domains/replies/entities/GetReply");

describe("replyRepositoryPostgres", () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addReply function", () => {
        it("should persist new reply", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const { content } = new AddReply({
                content: "a reply",
            });

            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await replyRepositoryPostgres.addReply("user-123", "comment-123", content);

            const replys = await RepliesTableTestHelper.findRepliesById(
                "reply-123"
            );
            expect(replys).toHaveLength(1);
        });

        it("should return added reply correctly", async () => {
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const { content } = new AddReply({
                content: "a reply",
            });

            const fakeIdGenerator = () => "123";
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedReply = await replyRepositoryPostgres.addReply("user-123", "comment-123", content);

            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: "reply-123",
                    content: "a reply",
                    owner: "user-123",
                })
            );
        });
    });

    describe("verifyReplyOwner function", () => {
        it("should throw authorization error for unauthorized owner", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await RepliesTableTestHelper.addReplies({ id: 'reply-123', user_id: 'user-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool, () => { }
            );

            const idUser = "user-124";
            const replyId = "reply-123";

            await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, idUser)).rejects.toThrow(AuthorizationError);
        });

        it("should not throw authorization error for authorized owner", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await RepliesTableTestHelper.addReplies({ id: 'reply-123', user_id: 'user-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool, () => { }
            );

            const idUser = "user-123";
            const replyId = "reply-123";

            await expect(replyRepositoryPostgres.verifyReplyOwner(replyId, idUser)).resolves.not.toThrow(AuthorizationError);
        });
    });

    describe("availabilityReply function", () => {
        it("should throw notfound error for unexisted reply", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await RepliesTableTestHelper.addReplies({ id: 'reply-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool, () => { }
            );

            const replyId = "reply-124";

            await expect(replyRepositoryPostgres.availabilityReply(replyId)).rejects.toThrow(NotFoundError);
        });

        it("should not throw notfound error for existed reply", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await RepliesTableTestHelper.addReplies({ id: 'reply-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool, () => { }
            );

            const replyId = "reply-123";

            await expect(replyRepositoryPostgres.availabilityReply(replyId)).resolves.not.toThrow(NotFoundError);
        });
    });

    describe("deleteReply function", () => {
        it("reply should have been deleted", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await RepliesTableTestHelper.addReplies({ id: 'reply-123' });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool, () => { }
            );

            const replyId = "reply-123";

            await replyRepositoryPostgres.deleteReply(replyId);

            const reply = await RepliesTableTestHelper.findRepliesById(replyId);

            expect(reply[0].is_deleted).toEqual(true);
        });
    });

    describe("getRepliesByThreadId function", () => {
        it("should return empty array when no replies is found", async () => {
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
            await CommentsTableTestHelper.addComments({ id: "comment-123" });

            const replyRepository = new ReplyRepositoryPostgres(pool, () => { });

            const replies = await replyRepository.getRepliesByCommentId(
                "comment-123"
            );

            expect(replies).toHaveLength(0);
        });

        it("should return replies from a comment correctly", async () => {
            const mockDate = new Date("2025-06-04").toISOString();
            const mockDate2 = new Date("2025-06-04").toISOString();
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
            await CommentsTableTestHelper.addComments({ id: "comment-123" });
            await RepliesTableTestHelper.addReplies({
                id: "reply-123",
                content: "content reply-123",
                date: mockDate,
            });
            await RepliesTableTestHelper.addReplies({
                id: "reply-321",
                content: "content reply-321",
                date: mockDate2,
            });
            const commentId = "comment-123";

            const replyRepository = new ReplyRepositoryPostgres(pool, () => { });

            const replies = await replyRepository.getRepliesByCommentId(commentId);

            expect(replies).toHaveLength(2);
            expect(replies[0]).toStrictEqual(
                new GetReply({
                    id: "reply-123",
                    username: "dicoding",
                    date: mockDate,
                    content: "content reply-123",
                    is_deleted: false,
                })
            );
            expect(replies[1]).toStrictEqual(
                new GetReply({
                    id: "reply-321",
                    username: "dicoding",
                    date: mockDate2,
                    content: "content reply-321",
                    is_deleted: false,
                })
            );
        });
    });
});