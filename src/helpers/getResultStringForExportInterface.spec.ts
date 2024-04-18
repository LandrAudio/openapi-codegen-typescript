import { getResultStringForExportInterface } from './getResultStringForExportInterface';

const scenarios = [
    {
        scenarioName: 'All props defined',
        props: {
            schemaKey: 'schemaKey mocked',
            schema: {
                description: 'description mocked',
                properties: {
                    type: 'type mocked',
                },
            },
            interfaces: ['first', 'second', 'third'],
        },
        expected: `/**\n * description mocked\n */\nexport interface schemaKey mocked extends first, second, third {\n`,
    },
    {
        scenarioName: 'Interface undefined',
        props: {
            schemaKey: 'schemaKey mocked',
            schema: {
                description: 'description mocked',
                properties: {
                    type: 'type mocked',
                },
            },
            interfaces: undefined,
        },
        expected: `/**\n * description mocked\n */\nexport interface schemaKey mocked {\n`,
    },
    {
        scenarioName: 'schemaKey undefined',
        props: {
            schemaKey: undefined,
            schema: {
                description: 'description mocked',
                properties: {
                    type: 'type mocked',
                },
            },
            interfaces: ['first', 'second', 'third'],
        },
        expected: `/**\n * description mocked\n */\nexport interface undefined extends first, second, third {\n`,
    },
    {
        scenarioName: 'description undefined',
        props: {
            schemaKey: 'schemaKey mocked',
            schema: {
                properties: {
                    type: 'type mocked',
                },
            },
            interfaces: ['first', 'second', 'third'],
        },
        expected: `export interface schemaKey mocked extends first, second, third {\n`,
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForExportInterface(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
