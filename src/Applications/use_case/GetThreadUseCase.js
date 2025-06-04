class GetThreadUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(threadId) {
        await this._threadRepository.checkThread(threadId);

        const comments = await this._commentRepository.getCommentsByThreadId(threadId);

        for(const comment of comments){
            const replies = await this._replyRepository.getRepliesByCommentId(comment.id);

            comment.replies = replies;
        }

        const threads = await this._threadRepository.getThread(threadId);

        threads.comments = comments;

        return threads;
    }
};

module.exports = GetThreadUseCase;