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
    const likes = await this._likeRepository.statusCommentLike(id, commentId);

    if (!likes) {
      await this._likeRepository.createCommentLike(id, commentId)
    } else {
      await this._likeRepository.updateCommentLike(likes.id, !likes.is_liked);
    }
  }
}

module.exports = LikeCommentUseCase;