const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
        const { id: idUser } = request.auth.credentials;
        const { threadId, commentId } = request.params;

        const addedReply = await addReplyUseCase.execute(idUser, commentId, threadId, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        const { id: idUser } = request.auth.credentials;
        const { commentId, replyId } = request.params;

        await deleteReplyUseCase.execute(replyId, idUser);

        const response = h.response({
            status: "success",
        });

        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;
