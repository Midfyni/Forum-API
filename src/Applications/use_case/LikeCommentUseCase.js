class LikeCommentUseCase {
  constructor({ commentRepository, likeRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCaseAuth, useCaseParam) {
    const { id } = useCaseAuth;
    const { threadId, commentId } = useCaseParam;

    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.availabilityComment(commentId);
    await this._likeRepository.updateCommentLike(id, commentId);
  }
}

module.exports = LikeCommentUseCase;