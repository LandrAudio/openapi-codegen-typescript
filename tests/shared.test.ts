import { swaggerV2Mock, swaggerV3Mock } from '../src/utils/test-utils';

jest.mock('node-fetch');
jest.mock('fs');

import { fetchSwaggerJsonFile, getSchemas, hashedString, writeToFile } from '../src/shared';
const { Response } = jest.requireActual('node-fetch');
const fetch = require('node-fetch');
const fs = require('fs');

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

    it('should return hashed value', async () => {
        const result = await hashedString('Some string');
        expect(result).toEqual(-1231765347);
    });

    it('should parse v2 schemas', async () => {
        const json = swaggerV2Mock({
            One: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
            Two: {
                type: 'object',
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
        });

        const parsedData = getSchemas({ json });

        const expected = {
            One: {
                properties: {
                    name: {
                        type: 'string',
                    },
                },
                type: 'object',
            },
            Two: {
                properties: {
                    name: {
                        type: 'number',
                    },
                },
                type: 'object',
            },
        };
        expect(parsedData).toEqual(expected);
    });

    it('should parse v3 schemas', async () => {
        const json = swaggerV3Mock({
            One: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
            Two: {
                type: 'object',
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
        });

        const parsedData = getSchemas({ json });

        const expected = {
            One: {
                properties: {
                    name: {
                        type: 'string',
                    },
                },
                type: 'object',
            },
            Two: {
                properties: {
                    name: {
                        type: 'number',
                    },
                },
                type: 'object',
            },
        };
        expect(parsedData).toEqual(expected);
    });

    it('should parse v3 schemas by default', async () => {
        const json = swaggerV3Mock({
            One: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                },
            },
            Two: {
                type: 'object',
                properties: {
                    name: {
                        type: 'number',
                    },
                },
            },
        });

        const parsedData = getSchemas({ json });

        const expected = {
            One: {
                properties: {
                    name: {
                        type: 'string',
                    },
                },
                type: 'object',
            },
            Two: {
                properties: {
                    name: {
                        type: 'number',
                    },
                },
                type: 'object',
            },
        };
        expect(parsedData).toEqual(expected);
    });

    it('should return "undefined" json object in not valid', async () => {
        const json = swaggerV3Mock(undefined);
        const parsedData = getSchemas({ json });
        expect(parsedData).toEqual(undefined);
    });

    it('should write to file', async () => {
        fs.existsSync.mockReturnValue(false);
        fs.mkdirSync.mockReturnValue(false);

        writeToFile({
            fileName: 'test',
            folderPath: './not-existing-folder/some',
            resultString: 'result',
        });

        await expect(fs.existsSync).toHaveBeenCalled();
        await expect(fs.mkdirSync).toHaveBeenCalled();
        await expect(fs.writeFileSync).toHaveBeenCalled();
    });
});
