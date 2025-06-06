const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create added reply object correctly', () => {
        // Arrange
        const payload = {
            content: 'content-123',
        };

        // Action
        const { content } = new AddReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
