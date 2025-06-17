const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const pool = require("../../../Infrastructures/database/postgres/pool");
const LikesRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("likeRepositoryPostgres", () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("statusCommentLike function", () => {
        it("comment like is found, should return corretly", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await LikesTableTestHelper.addLikes({ id: 'like-123' });

            const expectedResult = {
                id: 'like-123',
                is_liked: true
            };

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

            const likes = await likeRepositoryPostgres.statusCommentLike("user-123", "comment-123");
            expect(likes).toEqual(expectedResult);
        });
    });

    describe("createCommentLike function", () => {
        it("create like comment, should return corretly", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

            await likeRepositoryPostgres.createCommentLike("user-123", "comment-123");

            const likes = await LikesTableTestHelper.findLikesById('like-123');
            expect(likes).toHaveLength(1);
            expect(likes[0].id).toEqual("like-123");
            expect(likes[0].is_liked).toEqual(true);
        });
    });

    describe("updateCommentLike function", () => {
        it("Update comment like correctly", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });
            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await LikesTableTestHelper.addLikes({ id: 'like-123' });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

            await likeRepositoryPostgres.updateCommentLike("like-123", false);

            const likes = await LikesTableTestHelper.findLikesById('like-123');
            expect(likes[0].is_liked).toEqual(false);
        });
    });

    describe("countCommentLike function", () => {
        it("Should count comment like correctly", async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThreads({ id: 'thread-123' });

            await CommentsTableTestHelper.addComments({ id: 'comment-123' });
            await LikesTableTestHelper.addLikes({ id: 'like-123', comment_id: 'comment-123' });
            await LikesTableTestHelper.addLikes({ id: 'like-321', comment_id: 'comment-123' });

            await CommentsTableTestHelper.addComments({ id: 'comment-321' });
            await LikesTableTestHelper.addLikes({ id: 'like-456', comment_id: 'comment-321' });
            await LikesTableTestHelper.addLikes({ id: 'like-654', comment_id: 'comment-321' });
            await LikesTableTestHelper.addLikes({ id: 'like-789', comment_id: 'comment-321' });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikesRepositoryPostgres(pool, fakeIdGenerator);

            const likes1 = await likeRepositoryPostgres.countCommentLikes("comment-123");
            const likes2 = await likeRepositoryPostgres.countCommentLikes("comment-321");

            expect(likes1).toEqual(2);
            expect(likes2).toEqual(3);
        });
    });
})