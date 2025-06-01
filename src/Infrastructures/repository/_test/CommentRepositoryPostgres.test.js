const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../../Infrastructures/database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const GetThread = require("../../../Domains/threads/entities/GetThread");

describe("commentRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("addComment function", () => {
        it("should persist new comment", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({id: 'thread-123'});

            // await UsersTableTestHelper.addUser({ id: 'user-321', username: 'johndoe', password: 'secret', fullname: 'John Doe' });
            const addComment = new AddComment({
                content: "a comment",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            await commentRepositoryPostgres.addComment("user-123", "thread-123", addComment);

            const comments = await CommentsTableTestHelper.findCommentsById(
                "comment-123"
            );
            expect(comments).toHaveLength(1);
        });

        it("should return added comment correctly", async () => {
            await UsersTableTestHelper.addUser({ id: "user-123" });
            await ThreadsTableTestHelper.addThreads({id: 'thread-123'});

            const addComment = new AddComment({
                content: "a comment",
            });

            const fakeIdGenerator = () => "123";
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator
            );

            const addedComment = await commentRepositoryPostgres.addComment("user-123", "thread-123", addComment);

            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: "comment-123",
                    content: "a comment",
                    owner: "user-123",
                })
            );
        });
    });
});