const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'judul',
            body: 'isi',
        };

        const mockAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'owner-123',
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThread));

        // console.log("Nilai mockThreadRepository.addthread: " + mockThreadRepository.addThread);
        /** creating use case instance */
        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await getThreadUseCase.execute('user-123', useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: 'owner-123',
        }));
        expect(mockThreadRepository.addThread).toHaveBeenCalledWith(
            "user-123",
            new AddThread({
                title: useCasePayload.title,
                body: useCasePayload.body,
            })
        );
    });
});
