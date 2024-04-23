import { ParseObjectProps, parseObject } from './parseObject';
import {
    ConvertToTypesFromSchemaPropertiesProps,
    convertToTypesFromSchemaProperties,
} from './convertToTypesFromSchemaProperties';
import { aSwaggerV2Mock, aSwaggerV3Mock } from '../utils/test-utils';

jest.mock('./convertToTypesFromSchemaProperties', () => ({
    convertToTypesFromSchemaProperties: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const SchemaWithAllOf = {
    allOf: [
        { $ref: 'pathname/first', type: 'first type mocked' },
        { $ref: 'pathname/second', type: 'second type mocked' },
    ],
};

const scenarios: [string, { input: ParseObjectProps; output: ConvertToTypesFromSchemaPropertiesProps }][] = [
    [
        'With all props defined',
        {
            input: {
                schema: {
                    description: 'any',
                    properties: {
                        type: 'string',
                    },
                },
                schemaKey: 'schemaKey mocked',
            },
            output: {
                schema: {
                    description: 'any',
                    properties: {
                        type: 'string',
                    },
                },
                schemaKey: 'schemaKey mocked',
            },
        },
    ],
    [
        'With allOf defined',
        {
            input: { schema: SchemaWithAllOf, schemaKey: 'schemaKey mocked' },
            output: {
                schema: {
                    $ref: 'pathname/first',
                    type: 'first type mocked',
                },
                schemaKey: 'schemaKey mocked',
                interfaces: ['first', 'second'],
            },
        },
    ],
];

describe(`parseObject`, () => {
    it.each(scenarios)(
        `should call convertToTypesFromSchemaProperties with expected parameters for  %s`,
        (_, { input, output }) => {
            parseObject(input);

            expect(convertToTypesFromSchemaProperties).toHaveBeenCalledWith(output);
        },
    );
});
