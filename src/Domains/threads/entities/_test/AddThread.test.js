const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
            owner: 'abc',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: true,
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create added thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'thread-123',
            body: 'body-123',
        };

        // Action
        const { title, body } = new AddThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });

    it('should throw error when title contains more than 50 characters', () => {
        const payload = {
            title: 'forumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapiforumapi',
            body: 'body-123',
        };

        expect(() => new AddThread(payload)).toThrowError('ADDTHREAD.TITLE_LIMIT_CHAR');
    });
});
