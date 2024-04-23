import { ResultStringForExportInterface, getResultStringForExportInterface } from './getResultStringForExportInterface';

const scenarios: { input: ResultStringForExportInterface; output: string }[] = [
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
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForExportInterface(input);

    expect(result).toBe(output);
});
