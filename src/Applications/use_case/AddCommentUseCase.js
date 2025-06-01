const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(userId, threadId, useCasePayload) {
        const newComment = new AddComment(useCasePayload);

        await this._threadRepository.checkThread(threadId);

        return this._commentRepository.addComment(userId, threadId,newComment);
    }
}

module.exports = AddCommentUseCase;
