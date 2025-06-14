const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesHandler {
    constructor(container) {
        this._container = container;

        this.putLikeHandler = this.putLikeHandler.bind(this);
    }

    async putLikeHandler(request, h) {

        const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

        await likeCommentUseCase.execute(request.auth.credentials, request.params);

        const response = h.response({
            status: 'success',
        });

        response.code(200);
        return response;

    }
}

module.exports = LikesHandler;
