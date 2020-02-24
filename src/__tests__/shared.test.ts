jest.mock('node-fetch');

import { fetchSwaggerJsonFile } from '../shared';
const { Response } = jest.requireActual('node-fetch');
const fetch = require('node-fetch');

describe('TS types generation', () => {
    it('should fetch swagger json file', async () => {
        fetch.mockReturnValue(
            Promise.resolve(
                new Response(
                    JSON.stringify({
                        components: {
                            schemas: {
                                AssetDto: {},
                            },
                        },
                    }),
                ),
            ),
        );

        const url = 'https://fake/swagger/v1/swagger.json';

        const result = await fetchSwaggerJsonFile(url);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(url);
        expect(result).toEqual({
            components: {
                schemas: {
                    AssetDto: {},
                },
            },
        });
    });
});
