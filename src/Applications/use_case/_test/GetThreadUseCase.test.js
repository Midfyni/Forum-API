const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const GetComment = require("../../../Domains/comments/entities/GetComment");
const GetReply = require("../../../Domains/replies/entities/GetReply");
const GetThread = require("../../../Domains/threads/entities/GetThread");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
    it("should orchestrating the get thread action correctly", async () => {
        const mockDate = new Date("2024-10-27").toISOString();
        const mockDate2 = new Date("2024-10-28").toISOString();
        const mockGetThread = new GetThread({
            id: "thread-123",
            title: "a thread",
            body: "a thread body",
            date: mockDate,
            username: "dicoding",
            comments: [],
            owner: "user-123",
        });

        const mockGetComment1 = new GetComment({
            id: "comment-123",
            username: "dicoding",
            date: mockDate,
            content: "a comment",
            replies: [],
            likeCount: 0,
            is_deleted: false,
        });

        const mockGetComment2 = new GetComment({
            id: "comment-321",
            username: "dicoding",
            date: mockDate2,
            content: "a comment",
            replies: [],
            likeCount: 0,
            is_deleted: false,
        });

        const mockGetReply = new GetReply({
            id: "reply-123",
            username: "dicoding",
            date: mockDate,
            content: "a reply",
            is_deleted: false,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.checkThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.getThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockGetThread));
        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([mockGetComment1, mockGetComment2]));
        mockReplyRepository.getRepliesByCommentId = jest.fn()
            .mockImplementation(() => Promise.resolve([mockGetReply]));
        mockLikeRepository.countCommentLikes = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        });

        const thread = await getThreadUseCase.execute("thread-123");

        expect(thread).toStrictEqual(
            new GetThread({
                id: "thread-123",
                title: "a thread",
                body: "a thread body",
                date: mockDate,
                username: "dicoding",
                comments: [
                    new GetComment({
                        id: "comment-123",
                        username: "dicoding",
                        date: mockDate,
                        content: "a comment",
                        replies: [
                            new GetReply({
                                id: "reply-123",
                                username: "dicoding",
                                date: mockDate,
                                content: "a reply",
                                is_deleted: false,
                            }),
                        ],
                        likeCount: 0,
                        is_deleted: false,
                    }),
                    new GetComment({
                        id: "comment-321",
                        username: "dicoding",
                        date: mockDate2,
                        content: "a comment",
                        replies: [
                            new GetReply({
                                id: "reply-123",
                                username: "dicoding",
                                date: mockDate,
                                content: "a reply",
                                is_deleted: false,
                            }),
                        ],
                        likeCount: 0,
                        is_deleted: false,
                    }),
                ],
                owner: "user-123",
            })
        );

        expect(mockThreadRepository.checkThread).toHaveBeenCalledWith("thread-123");
        expect(mockThreadRepository.getThread).toHaveBeenCalledWith("thread-123");
        expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(
            "thread-123"
        );
        expect(mockReplyRepository.getRepliesByCommentId).toHaveBeenCalledWith(
            "comment-123"
        );
    });
});