class LikeRepository {
    async updateCommentLike(idUser, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async countCommentLikes(idComment){
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeRepository;
