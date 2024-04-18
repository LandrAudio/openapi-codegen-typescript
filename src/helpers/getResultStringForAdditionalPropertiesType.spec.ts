import { getResultStringForAdditionalPropertiesType } from './getResultStringForAdditionalPropertiesType';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';

jest.mock('./getDictionaryValueResultString', () => ({
    getDictionaryValueResultString: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const scenarios = [
    {
        scenarioName: 'Boolean additional properties type',
        props: {
            additionalProperties: { type: 'boolean' },
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: boolean;\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: 'boolean',
        },
    },
    {
        scenarioName: 'Integer additional properties type',
        props: {
            additionalProperties: { type: 'integer' },
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: number;\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: 'number',
        },
    },
    {
        scenarioName: 'Number additional properties type',
        props: {
            additionalProperties: { type: 'number' },
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: number;\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: 'number',
        },
    },
    {
        scenarioName: 'String additional properties type',
        props: {
            additionalProperties: { type: 'string' },
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: string;\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: 'string',
        },
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
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: "// Error: The additionalProperties items or the items ref is missing";\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: '"// Error: The additionalProperties items or the items ref is missing"',
        },
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
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: AssetFileDto[];\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: 'AssetFileDto[]',
        },
    },
    {
        scenarioName: 'Invalid additional properties type',
        props: {
            additionalProperties: { type: 'test' },
            description: 'description mocked',
            propertyName: 'propertyName mocked',
        },
        expectedString: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n [key: string]: "// Error: test is not supported";\n };\n`,
        expectedParams: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'ref-value',
            value: '"// Error: test is not supported"',
        },
    },
];

describe(`getResultStringForAdditionalPropertiesType`, () => {
    scenarios.forEach(config => {
        it(`should return expected result when props is ${config.scenarioName} and xDictionaryKey is undefined`, async () => {
            const result = getResultStringForAdditionalPropertiesType({ ...config.props, xDictionaryKey: undefined });

            expect(result).toBe(config.expectedString);
        });
    });

    scenarios.forEach(config => {
        it(`should invoke getDictionaryValueResultString with expected props when scenario is ${config.scenarioName} and xDictionaryKey is defined`, async () => {
            getResultStringForAdditionalPropertiesType({
                ...config.props,
                xDictionaryKey: {
                    $ref: 'path/ref-value',
                },
            });

            expect(getDictionaryValueResultString).toHaveBeenCalledWith(config.expectedParams);
        });
    });
});
