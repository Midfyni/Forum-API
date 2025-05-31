const AddComment = require('../../Domains/threads/entities/');

class AddCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(userId, useCasePayload) {
        
        const newComment = new AddComment(useCasePayload);

        return this._commentRepository.addComment(userId, newComment);
    }
}

module.exports = AddThreadUseCase;
