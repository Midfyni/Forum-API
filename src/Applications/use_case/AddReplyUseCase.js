const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(userId, commentId, threadId, useCasePayload) {
        const { content } = new AddReply(useCasePayload);

        await this._threadRepository.checkThread(threadId);

        await this._commentRepository.availabilityComment(commentId);

        return this._replyRepository.addReply(userId, commentId, content);
    }
}

module.exports = AddReplyUseCase;
