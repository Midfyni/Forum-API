const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            content: 'a comment',
        };

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'owner-123',
        });

        const checkThreadPayload = {
            threadId: 'thread-123',
        };

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedComment));

        mockThreadRepository.checkThread = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const getCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedComment = await getCommentUseCase.execute('user-123', 'thread-123', useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: 'owner-123',
        }));
        expect(mockThreadRepository.checkThread).toHaveBeenCalledWith("thread-123");
        expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
            "user-123",
            "thread-123",
            useCasePayload.content
        );
    });
});
