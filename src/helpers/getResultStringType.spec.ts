import { getResultStringType } from './getResultStringType';

const defaultProps = {
    type: 'invalid',
    items: undefined,
    oneOf: undefined,
    xDictionaryKey: undefined,
    additionalProperties: undefined,
    $ref: undefined,
};

const scenarios = [
    {
        scenarioName: 'String type',
        props: {
            ...defaultProps,
            type: 'string',
        },
        expected: `String`,
    },
    {
        scenarioName: 'Integer type',
        props: {
            ...defaultProps,
            type: 'integer',
        },
        expected: `Number`,
    },
    {
        scenarioName: 'Number type',
        props: {
            ...defaultProps,
            type: 'number',
        },
        expected: `Number`,
    },
    {
        scenarioName: 'Boolean type',
        props: {
            ...defaultProps,
            type: 'boolean',
        },
        expected: `Boolean`,
    },
    {
        scenarioName: 'Items with ref',
        props: {
            ...defaultProps,
            type: 'array',
            items: {
                $ref: '$ref mocked',
            },
        },
        expected: `ItemWithRef`,
    },
    {
        scenarioName: 'Items without ref',
        props: {
            ...defaultProps,
            type: 'array',
            items: [],
        },
        expected: `ItemWithoutRef`,
    },
    {
        scenarioName: 'OneOf',
        props: {
            ...defaultProps,
            oneOf: [{ $ref: '$ref mocked' }],
        },
        expected: `OneOf`,
    },
    {
        scenarioName: 'Ref',
        props: {
            ...defaultProps,
            $ref: '$ref mocked',
        },
        expected: `Ref`,
    },
    {
        scenarioName: 'Undefined type, ref and oneOf',
        props: {
            ...defaultProps,
            type: (undefined as unknown) as string,
            $ref: undefined,
            oneOf: undefined,
        },
        expected: `UndefinedTypeRefAndOneOf`,
    },
    {
        scenarioName: 'Undefined type, ref and oneOf',
        props: {
            ...defaultProps,
            xDictionaryKey: {
                $ref: '$ref mocked',
            },
            additionalProperties: {
                $ref: '$ref mocked',
            },
        },
        expected: `DictionaryKey`,
    },
    {
        scenarioName: 'No additionalProperties $ref',
        props: {
            ...defaultProps,
            xDictionaryKey: {
                $ref: '$ref mocked',
            },
            additionalProperties: {
                type: 'type mocked',
            },
        },
        expected: `AdditionalPropertiesType`,
    },
    {
        scenarioName: 'No xDictionaryKey and additionalProperties $ref',
        props: {
            ...defaultProps,
            xDictionaryKey: undefined,
            additionalProperties: {
                type: 'type mocked',
            },
        },
        expected: `AdditionalPropertiesType`,
    },
    {
        scenarioName: 'Invalid',
        props: {
            ...defaultProps,
            type: 'unsupported type',
        },
        expected: `Invalid`,
    },
];

describe(`getResultStringType`, () => {
    scenarios.forEach(config => {
        it(`should return ${config.expected} for ${config.scenarioName}`, async () => {
            const result = getResultStringType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
