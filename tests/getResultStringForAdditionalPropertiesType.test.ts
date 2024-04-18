import { getResultStringForAdditionalPropertiesType } from '../src/helpers/getResultStringForAdditionalPropertiesType';

const scenarios = [
    {
        scenarioName: 'Boolean additional properties type',
        props: {
            additionalProperties: { type: 'boolean' },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: boolean;\n };\n`,
    },
    {
        scenarioName: 'Integer additional properties type',
        props: {
            additionalProperties: { type: 'integer' },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: number;\n };\n`,
    },
    {
        scenarioName: 'Number additional properties type',
        props: {
            additionalProperties: { type: 'number' },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: number;\n };\n`,
    },
    {
        scenarioName: 'String additional properties type',
        props: {
            additionalProperties: { type: 'string' },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: string;\n };\n`,
    },
    {
        scenarioName: 'Array additional properties type without item ref',
        props: {
            additionalProperties: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: "// TODO: Something is wrong";\n };\n`,
    },

    {
        scenarioName: 'Array additional properties type with item ref',
        props: {
            additionalProperties: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/AssetFileDto',
                },
            },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: AssetFileDto[];\n };\n`,
    },
    {
        scenarioName: 'Invalid additional properties type',
        props: {
            additionalProperties: { type: 'test' },
            description: 'mock description',
            propertyName: 'mock property name',
        },
        expected: `/**\n * mock description\n */\n\tmock property name: {\n [key: string]: "// TODO: Something is wrong, type test is not supported";\n };\n`,
    },
];

describe(`getResultStringForAdditionalPropertiesType`, () => {
    scenarios.forEach(config => {
        it(`should return expected result when props is ${config.scenarioName}`, async () => {
            const result = getResultStringForAdditionalPropertiesType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
