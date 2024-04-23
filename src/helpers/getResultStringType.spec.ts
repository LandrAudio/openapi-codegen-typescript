import { SchemaProperties } from '../types';
import { getResultStringType } from './getResultStringType';

const defaultProps = {
    type: 'invalid',
    items: undefined,
    oneOf: undefined,
    xDictionaryKey: undefined,
    additionalProperties: undefined,
    $ref: undefined,
};

const scenarios: [
    string,
    {
        input: Pick<
            SchemaProperties,
            'type' | 'additionalProperties' | 'items' | 'oneOf' | 'xDictionaryKey' | 'additionalProperties' | '$ref'
        >;
        output: string;
    },
][] = [
    [
        'String type',
        {
            input: {
                ...defaultProps,
                type: 'string',
            },
            output: `String`,
        },
    ],
    [
        'Integer type',
        {
            input: {
                ...defaultProps,
                type: 'integer',
            },
            output: `Number`,
        },
    ],
    [
        'Number type',
        {
            input: {
                ...defaultProps,
                type: 'number',
            },
            output: `Number`,
        },
    ],
    [
        'Boolean type',
        {
            input: {
                ...defaultProps,
                type: 'boolean',
            },
            output: `Boolean`,
        },
    ],
    [
        'Items with ref',
        {
            input: {
                ...defaultProps,
                type: 'array',
                items: {
                    $ref: '$ref mocked',
                },
            },
            output: `ItemWithRef`,
        },
    ],
    [
        'Items without ref',
        {
            input: {
                ...defaultProps,
                type: 'array',
                items: [],
            },
            output: `ItemWithoutRef`,
        },
    ],
    [
        'OneOf',
        {
            input: {
                ...defaultProps,
                oneOf: [{ $ref: '$ref mocked' }],
            },
            output: `OneOf`,
        },
    ],
    [
        'Ref',
        {
            input: {
                ...defaultProps,
                $ref: '$ref mocked',
            },
            output: `Ref`,
        },
    ],
    [
        'Undefined type, ref and oneOf',
        {
            input: {
                ...defaultProps,
                type: (undefined as unknown) as string,
                $ref: undefined,
                oneOf: undefined,
            },
            output: `UndefinedTypeRefAndOneOf`,
        },
    ],
    [
        'Undefined type, ref and oneOf',
        {
            input: {
                ...defaultProps,
                xDictionaryKey: {
                    $ref: '$ref mocked',
                },
                additionalProperties: {
                    $ref: '$ref mocked',
                },
            },
            output: `DictionaryKey`,
        },
    ],
    [
        'No additionalProperties $ref',
        {
            input: {
                ...defaultProps,
                xDictionaryKey: {
                    $ref: '$ref mocked',
                },
                additionalProperties: {
                    type: 'type mocked',
                },
            },
            output: `AdditionalPropertiesType`,
        },
    ],
    [
        'No xDictionaryKey and additionalProperties $ref',
        {
            input: {
                ...defaultProps,
                xDictionaryKey: undefined,
                additionalProperties: {
                    type: 'type mocked',
                },
            },
            output: `AdditionalPropertiesType`,
        },
    ],
    [
        'Invalid',
        {
            input: {
                ...defaultProps,
                type: 'unsupported type',
            },
            output: `Invalid`,
        },
    ],
];

describe(`getResultStringType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringType(input);

        expect(result).toBe(output);
    });
});
