const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted user', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'asdasd',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'asdasd',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const requestPayload = {
                title: 'title test',
                body: 'body test',
            };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'mj23',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'mj23',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const requestPayload = {
                title: 'title test',
            };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'auba',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'auba',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const requestPayload = {
                title: 'title test',
                body: { test: true },
            };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });

        it('should response 400 when username more than 50 character', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'toretto',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'toretto',
                    password: 'secret',
                },
            });
            const { data: { accessToken } } = JSON.parse(loginResponse.payload);

            const requestPayload = {
                title: 'titletitletitletitletitletitletitletitletitletitletitletitle',
                body: 'body body',
            };

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena karakter title melebihi batas limit');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and return thread detail with its comments', async () => {
            const server = await createServer(container);
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'wrsupratman',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const ownerLoginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'wrsupratman',
                    password: 'secret',
                },
            });
            const { data: { accessToken: ownerAccessToken } } = JSON.parse(ownerLoginResponse.payload);

            const addedThreadResponse = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'title test',
                    body: 'body test',
                },
                headers: {
                    Authorization: `Bearer ${ownerAccessToken}`,
                },
            });
            const { data: { addedThread } } = JSON.parse(addedThreadResponse.payload);

            await server.inject({
                method: 'POST',
                url: `/threads/${addedThread.id}/comments`,
                payload: { content: 'tes tes konten tes' },
                headers: {
                    Authorization: `Bearer ${ownerAccessToken}`,
                },
            });

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: '17agustus',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const otherLoginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: '17agustus',
                    password: 'secret',
                },
            });
            const { data: { otherAccessToken } } = JSON.parse(otherLoginResponse.payload);

            await server.inject({
                method: 'POST',
                url: `/threads/${addedThread.id}/comments`,
                payload: { content: 'tes tes konten tes' },
                headers: {
                    Authorization: `Bearer ${otherAccessToken}`,
                },
            });

            const threadsDetailResponse = await server.inject({
                method: 'GET',
                url: `/threads/${addedThread.id}`,
            });

            const responseJson = JSON.parse(threadsDetailResponse.payload);
            expect(threadsDetailResponse.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });
    });
});