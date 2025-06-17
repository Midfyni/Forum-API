const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('like comment likes use case', () => {
    it('should create like if no existing like found', async () => {
        const useCaseAuth = { id: 'user-123' };
        const useCaseParam = { threadId: 'thread-123', commentId: 'comment-234' };

        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.availabilityComment = jest.fn(() => Promise.resolve());
        mockLikeRepository.statusCommentLike = jest.fn(() => Promise.resolve(undefined));
        mockLikeRepository.createCommentLike = jest.fn(() => Promise.resolve());
        mockLikeRepository.updateCommentLike = jest.fn(() => Promise.resolve());

        const useCase = new LikeCommentUseCase({
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
        });

        await useCase.execute(useCaseAuth, useCaseParam);

        expect(mockThreadRepository.checkThread).toBeCalledWith(useCaseParam.threadId);
        expect(mockCommentRepository.availabilityComment).toBeCalledWith(useCaseParam.commentId);
        expect(mockLikeRepository.statusCommentLike).toBeCalledWith(useCaseAuth.id, useCaseParam.commentId);
        expect(mockLikeRepository.createCommentLike).toBeCalledWith(useCaseAuth.id, useCaseParam.commentId);
        expect(mockLikeRepository.updateCommentLike).not.toBeCalled();
    });

    it('should update like if existing like is found', async () => {
        const useCaseAuth = { id: 'user-123' };
        const useCaseParam = { threadId: 'thread-123', commentId: 'comment-234' };

        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
        mockCommentRepository.availabilityComment = jest.fn(() => Promise.resolve());
        mockLikeRepository.statusCommentLike = jest.fn(() =>
            Promise.resolve({ id: 'like-456', is_liked: true })
        );
        mockLikeRepository.createCommentLike = jest.fn(() => Promise.resolve());
        mockLikeRepository.updateCommentLike = jest.fn(() => Promise.resolve());

        const useCase = new LikeCommentUseCase({
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
        });

        await useCase.execute(useCaseAuth, useCaseParam);

        expect(mockLikeRepository.createCommentLike).not.toBeCalled();
        expect(mockLikeRepository.updateCommentLike).toBeCalledWith('like-456', false);
    });
});