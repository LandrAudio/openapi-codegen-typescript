import { getResultStringForAdditionalPropertiesType } from './getResultStringForAdditionalPropertiesType';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';
import { DictionaryValueResultString, ResultStringForAdditionalPropertiesType } from '../types';

jest.mock('./getDictionaryValueResultString', () => ({
    getDictionaryValueResultString: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const scenarios: [
    string,
    { input: ResultStringForAdditionalPropertiesType; outputString: string; outputParams: DictionaryValueResultString },
][] = [
    [
        'Boolean additional properties type',
        {
            input: {
                additionalProperties: { type: 'boolean' },
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: boolean;\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: 'boolean',
            },
        },
    ],
    [
        'Integer additional properties type',
        {
            input: {
                additionalProperties: { type: 'integer' },
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: number;\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: 'number',
            },
        },
    ],
    [
        'Number additional properties type',
        {
            input: {
                additionalProperties: { type: 'number' },
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: number;\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: 'number',
            },
        },
    ],
    [
        'String additional properties type',
        {
            input: {
                additionalProperties: { type: 'string' },
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: string;\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: 'string',
            },
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
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: "// Error: The additionalProperties items or the items ref is missing";\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: '"// Error: The additionalProperties items or the items ref is missing"',
            },
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
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: AssetFileDto[];\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: 'AssetFileDto[]',
            },
        },
    ],
    [
        'Invalid additional properties type',
        {
            input: {
                additionalProperties: { type: 'test' },
                description: 'description mocked',
                propertyName: 'propertyName mocked',
            },
            outputString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key: string]: "// Error: test is not supported";\n};\n`,
            outputParams: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'ref-value',
                value: '"// Error: test is not supported"',
            },
        },
    ],
];

it.each(scenarios)(
    `should return expected result when props is %s and xDictionaryKey is undefined`,
    (_, { input, outputString }) => {
        const result = getResultStringForAdditionalPropertiesType({ ...input, xDictionaryKey: undefined });

        expect(result).toBe(outputString);
    },
);

it.each(scenarios)(
    `should return expected result when props is %s and xDictionaryKey is defined`,
    (_, { input, outputParams }) => {
        getResultStringForAdditionalPropertiesType({
            ...input,
            xDictionaryKey: {
                $ref: 'path/ref-value',
            },
        });

        expect(getDictionaryValueResultString).toHaveBeenCalledWith(outputParams);
    },
);
