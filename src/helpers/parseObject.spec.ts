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

const scenarios: { input: ParseObjectProps; output: ConvertToTypesFromSchemaPropertiesProps }[] = [
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
];

it.each(scenarios)(
    `should call convertToTypesFromSchemaProperties with expected parameters for  %s`,
    ({ input, output }) => {
        parseObject(input);

        expect(convertToTypesFromSchemaProperties).toHaveBeenCalledWith(output);
    },
);
