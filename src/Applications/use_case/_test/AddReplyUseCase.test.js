const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            content: 'a reply',
        };

        const mockAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: 'owner-123',
        });

        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedReply));

        mockThreadRepository.checkThread = jest.fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.availabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const getReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedReply = await getReplyUseCase.execute('user-123', 'comment-123', 'thread-123', useCasePayload);

        // Assert
        expect(addedReply).toStrictEqual(new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: 'owner-123',
        }));
        expect(mockThreadRepository.checkThread).toHaveBeenCalledWith("thread-123");
        expect(mockCommentRepository.availabilityComment).toHaveBeenCalledWith("comment-123");
        expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
            "user-123",
            "comment-123",
            useCasePayload.content
        );
    });
});
