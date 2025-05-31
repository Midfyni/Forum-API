const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const newThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(userId, newThread);
  }
}

module.exports = AddThreadUseCase;
