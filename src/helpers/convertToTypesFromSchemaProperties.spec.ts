import { convertToTypesFromSchemaProperties } from './convertToTypesFromSchemaProperties';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';
import { getResultStringForArrayType } from './getResultStringForArrayType';
import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';
import { getResultStringForBooleanType } from './getResultStringForBooleanType';
import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';
import { getResultStringForExportInterface } from './getResultStringForExportInterface';
import { getResultStringForNumberType } from './getResultStringForNumberType';
import { getResultStringForStringType } from './getResultStringForStringType';
import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';
import { getStandardString } from './getStandardString';

jest.mock('./getResultStringForAdditionalPropertiesType', () => ({
    getResultStringForAdditionalPropertiesType: jest.fn(),
}));
jest.mock('./getDictionaryValueResultString', () => ({
    getDictionaryValueResultString: jest.fn(),
}));
jest.mock('./getResultStringForArrayType', () => ({
    getResultStringForArrayType: jest.fn(),
}));
jest.mock('./getResultStringForArrayWithoutItemRef', () => ({
    getResultStringForArrayWithoutItemRef: jest.fn(),
}));
jest.mock('./getResultStringForBooleanType', () => ({
    getResultStringForBooleanType: jest.fn(),
}));
jest.mock('./getResultStringForDictionaryKey', () => ({
    getResultStringForDictionaryKey: jest.fn(),
}));
jest.mock('./getResultStringForExportInterface', () => ({
    getResultStringForExportInterface: jest.fn(),
}));
jest.mock('./getResultStringForNumberType', () => ({
    getResultStringForNumberType: jest.fn(),
}));
jest.mock('./getResultStringForStringType', () => ({
    getResultStringForStringType: jest.fn(),
}));
jest.mock('./getResultStringForUndefinedTypeRefAndOneOf', () => ({
    getResultStringForUndefinedTypeRefAndOneOf: jest.fn(),
}));
jest.mock('./getStandardString', () => ({
    getStandardString: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const scenarios = [
    {
        scenarioName: 'Description provided',
        props: {
            schema: {
                description: 'description mocked',
                properties: {
                    type: 'string',
                },
            },
            schemaKey: 'schemaKey mocked',
            interfaces: undefined,
        },
        expected: `/**\n * description mocked\n */\n`,
    },
];

describe(`convertToTypesFromSchemaProperties`, () => {
    it(`should return expected string when for schema of type string`, async () => {
        const props = {
            schema: {
                description: 'description mocked',
                properties: {
                    type: 'string',
                },
            },
            schemaKey: 'schemaKey mocked',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForStringType).toHaveBeenCalledWith({
            propertyName: undefined,
            description: undefined,
            nullable: false,
            format: (undefined as unknown) as string,
            minLength: undefined,
            maxLength: undefined,
        });
    });
});
