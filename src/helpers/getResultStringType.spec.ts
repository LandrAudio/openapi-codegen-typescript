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

const scenarios: {
    input: Pick<
        SchemaProperties,
        'type' | 'additionalProperties' | 'items' | 'oneOf' | 'xDictionaryKey' | 'additionalProperties' | '$ref'
    >;
    output: string;
}[] = [
    {
        input: {
            ...defaultProps,
            type: 'string',
        },
        output: `String`,
    },
    {
        input: {
            ...defaultProps,
            type: 'integer',
        },
        output: `Number`,
    },
    {
        input: {
            ...defaultProps,
            type: 'number',
        },
        output: `Number`,
    },
    {
        input: {
            ...defaultProps,
            type: 'boolean',
        },
        output: `Boolean`,
    },
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
    {
        input: {
            ...defaultProps,
            type: 'array',
            items: [],
        },
        output: `ItemWithoutRef`,
    },
    {
        input: {
            ...defaultProps,
            oneOf: [{ $ref: '$ref mocked' }],
        },
        output: `OneOf`,
    },
    {
        input: {
            ...defaultProps,
            $ref: '$ref mocked',
        },
        output: `Ref`,
    },

    {
        input: {
            ...defaultProps,
            type: (undefined as unknown) as string,
            $ref: undefined,
            oneOf: undefined,
        },
        output: `UndefinedTypeRefAndOneOf`,
    },

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
    {
        input: {
            ...defaultProps,
            type: 'unsupported type',
        },
        output: `Invalid`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringType(input);

    expect(result).toBe(output);
});
