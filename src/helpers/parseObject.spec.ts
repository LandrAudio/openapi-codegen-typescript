import { parseObject } from './parseObject';
import { convertToTypesFromSchemaProperties } from './convertToTypesFromSchemaProperties';

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

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: { schema: 'schema mocked', schemaKey: 'schemaKey mocked' },
        expected: { schema: 'schema mocked', schemaKey: 'schemaKey mocked' },
    },
    {
        scenarioName: 'With oneOf',
        props: { schema: SchemaWithAllOf, schemaKey: 'schemaKey mocked' },
        expected: {
            schema: {
                $ref: 'pathname/first',
                type: 'first type mocked',
            },
            schemaKey: 'schemaKey mocked',
            interfaces: ['first', 'second'],
        },
    },
];

describe(`parseRefType`, () => {
    scenarios.forEach(config => {
        it(`should call convertToTypesFromSchemaProperties with expected parameters for ${config.scenarioName}`, async () => {
            parseObject(config.props);

            expect(convertToTypesFromSchemaProperties).toHaveBeenCalledWith(config.expected);
        });
    });
});
