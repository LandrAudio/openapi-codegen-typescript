import {
    getResultStringForAdditionalPropertiesType,
    ResultStringForAdditionalPropertiesType,
} from '../src/helpers/getResultStringForAdditionalPropertiesType';

const scenarios: [string, { input: ResultStringForAdditionalPropertiesType; output: string }][] = [
    [
        'Boolean additional properties type',
        {
            input: {
                additionalProperties: { type: 'boolean' },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: boolean;\n };\n`,
        },
    ],
    [
        'Integer additional properties type',
        {
            input: {
                additionalProperties: { type: 'integer' },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: number;\n };\n`,
        },
    ],
    [
        'Number additional properties type',
        {
            input: {
                additionalProperties: { type: 'number' },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: number;\n };\n`,
        },
    ],
    [
        'String additional properties type',
        {
            input: {
                additionalProperties: { type: 'string' },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: string;\n };\n`,
        },
    ],
    [
        'Array additional properties type without item ref',
        {
            input: {
                additionalProperties: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: "// TODO: Something is wrong";\n };\n`,
        },
    ],

    [
        'Array additional properties type with item ref',
        {
            input: {
                additionalProperties: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/AssetFileDto',
                    },
                },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: AssetFileDto[];\n };\n`,
        },
    ],
    [
        'Invalid additional properties type',
        {
            input: {
                additionalProperties: { type: 'test' },
                description: 'mock description',
                propertyName: 'mock property name',
            },
            output: `/**\n * mock description \n */\n    mock property name: {\n [key: string]: "// TODO: Something is wrong, type test is not supported";\n };\n`,
        },
    ],
];

describe(`getResultStringForAdditionalPropertiesType`, () => {
    it.each(scenarios)(`should return expected result when props is %s`, (_, { input, output }) => {
        const result = getResultStringForAdditionalPropertiesType(input);

        expect(result).toBe(output);
    });
});
