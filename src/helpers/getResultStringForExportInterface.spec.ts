import { ResultStringForExportInterface, getResultStringForExportInterface } from './getResultStringForExportInterface';

const scenarios: [string, { input: ResultStringForExportInterface; output: string }][] = [
    [
        'All props defined',
        {
            input: {
                schemaKey: 'schemaKey mocked',
                schema: {
                    description: 'description mocked',
                    properties: {
                        type: 'type mocked',
                    },
                },
                interfaces: ['first', 'second', 'third'],
            },
            output: `/**\n * description mocked\n */\nexport interface schemaKey mocked extends first, second, third {\n`,
        },
    ],

    [
        'Interface undefined',
        {
            input: {
                schemaKey: 'schemaKey mocked',
                schema: {
                    description: 'description mocked',
                    properties: {
                        type: 'type mocked',
                    },
                },
                interfaces: undefined,
            },
            output: `/**\n * description mocked\n */\nexport interface schemaKey mocked {\n`,
        },
    ],
    [
        'schemaKey undefined',
        {
            input: {
                schemaKey: undefined,
                schema: {
                    description: 'description mocked',
                    properties: {
                        type: 'type mocked',
                    },
                },
                interfaces: ['first', 'second', 'third'],
            },
            output: `/**\n * description mocked\n */\nexport interface undefined extends first, second, third {\n`,
        },
    ],
    [
        'description undefined',
        {
            input: {
                schemaKey: 'schemaKey mocked',
                schema: {
                    properties: {
                        type: 'type mocked',
                    },
                },
                interfaces: ['first', 'second', 'third'],
            },
            output: `export interface schemaKey mocked extends first, second, third {\n`,
        },
    ],
];

describe(`getResultStringForExportInterface`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForExportInterface(input);

        expect(result).toBe(output);
    });
});
