const LikeCommentUseCase = require('../LikeCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('like comment likes use case', () => {
    it('should orchestrating the set comment likes action correctly', async () => {
        const useCaseAuth = {
            id: 'user-123',
        };
        const useCaseParam = {
            threadId: 'thread-123',
            commentId: 'comment-234',
        };

        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
        const mockThreadRepostiry = new ThreadRepository();

        mockThreadRepostiry.checkThread = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.availabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockLikeRepository.updateCommentLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const updateCommentLikeUseCase = new LikeCommentUseCase({
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepostiry,
        });

        await updateCommentLikeUseCase.execute(useCaseAuth, useCaseParam);

        expect(mockThreadRepostiry.checkThread).toBeCalledWith(useCaseParam.threadId);
        expect(mockCommentRepository.availabilityComment).toBeCalledWith(useCaseParam.commentId);
        expect(mockLikeRepository.updateCommentLike).toBeCalledWith(useCaseAuth.id, useCaseParam.commentId);
    });
});