const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 and persisted likes status', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'abraham',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'abraham',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const addThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'title test',
                    body: 'body test',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${addedThread.id}/comments`,
                payload: { content: 'comment now' },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

            const setLikesResponse = await server.inject({
                method: 'PUT',
                url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(setLikesResponse.payload);
            expect(setLikesResponse.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when comment\'s thread to be liked not found', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'syahrir',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'syahrir',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const addThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'title test',
                    body: 'body test',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

            const addCommentResponse = await server.inject({
                method: 'POST',
                url: `/threads/${addedThread.id}/comments`,
                payload: { content: 'comment now' },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

            const setLikesResponse = await server.inject({
                method: 'PUT',
                url: `/threads/invalid-thread-id/comments/${addedComment.id}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(setLikesResponse.payload);
            expect(setLikesResponse.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 404 when comment to be liked not found', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'adammalik',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'adammalik',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const addThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'title test',
                    body: 'body test',
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

            const setLikesResponse = await server.inject({
                method: 'PUT',
                url: `/threads/${addedThread.id}/comments/invalid-comment-id/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(setLikesResponse.payload);
            expect(setLikesResponse.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Komen tidak ditemukan');
        });
    });
});