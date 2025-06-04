const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../../Infrastructures/database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const GetComment = require("../../../Domains/comments/entities/GetComment");

describe("commentRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addComment function", () => {
        it("should persist new comment", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });

            const { content } = new AddComment({
                content: "a comment",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment("user-123", "thread-123", content);

            const comments = await CommentsTableTestHelper.findCommentsById(
                "comment-123"
            );
            expect(comments).toHaveLength(1);
        });

        it("should return added comment correctly", async () => {
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });

            const { content } = new AddComment({
                content: "a comment",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedComment = await commentRepositoryPostgres.addComment("user-123", "thread-123", content);

            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: "comment-123",
                    content: "a comment",
                    owner: "user-123",
                })
            );
        });
    });

    describe("verifyCommentOwner function", () => {
        it("should throw authorization error for unauthorized owner", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123', user_id: 'user-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool, () => { }
            );

            const idUser = "user-124";
            const commentId = "comment-123";

            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, idUser)).rejects.toThrow(AuthorizationError);
        });

        it("should not throw authorization error for authorized owner", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123', user_id: 'user-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool, () => { }
            );

            const idUser = "user-123";
            const commentId = "comment-123";

            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, idUser)).resolves.not.toThrow(AuthorizationError);
        });
    });

    describe("availabilityComment function", () => {
        it("should throw notfound error for unexisted comment", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool, () => { }
            );

            const commentId = "comment-124";

            await expect(commentRepositoryPostgres.availabilityComment(commentId)).rejects.toThrow(NotFoundError);
        });

        it("should not throw notfound error for existed comment", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool, () => { }
            );

            const commentId = "comment-123";

            await expect(commentRepositoryPostgres.availabilityComment(commentId)).resolves.not.toThrow(NotFoundError);
        });
    });

    describe("deleteComment function", () => {
        it("comment should have been deleted", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool, () => { }
            );

            const commentId = "comment-123";

            await commentRepositoryPostgres.deleteComment(commentId);

            const comment = await CommentsTableTestHelper.findCommentsById(commentId);

            expect(comment[0].is_deleted).toEqual(true);
        });
    });

    describe("getCommentsByThreadId function", () => {
        it("should return empty array when no comments is found", async () => {
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: "thread-123" });

            const commentRepository = new CommentRepositoryPostgres(pool, () => { });

            const comments = await commentRepository.getCommentsByThreadId(
                "thread-123"
            );

            expect(comments).toHaveLength(0);
        });

        it("should return comments from a thread correctly", async () => {
            const mockDate = new Date("2024-10-27").toISOString();
            const mockDate2 = new Date("2024-10-28").toISOString();
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({ id: "thread-123" });
            await CommentsTableTestHelper.addComments({
                id: "comment-123",
                content: "comment from 123",
                date: mockDate,
            });
            await CommentsTableTestHelper.addComments({
                id: "comment-456",
                content: "comment from 456",
                date: mockDate2,
            });
            const threadId = "thread-123";

            const commentRepository = new CommentRepositoryPostgres(pool, () => { });

            const comments = await commentRepository.getCommentsByThreadId(threadId);

            expect(comments).toHaveLength(2);
            expect(comments[0]).toStrictEqual(
                new GetComment({
                    id: "comment-123",
                    username: "dicoding",
                    date: mockDate,
                    content: "comment from 123",
                    replies: [],
                })
            );
            expect(comments[1]).toStrictEqual(
                new GetComment({
                    id: "comment-456",
                    username: "dicoding",
                    date: mockDate2,
                    content: "comment from 456",
                    replies: [],
                })
            );
        });
    });
});