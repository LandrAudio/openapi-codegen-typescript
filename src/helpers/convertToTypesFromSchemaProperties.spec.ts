import { convertToTypesFromSchemaProperties } from './convertToTypesFromSchemaProperties';
import { getResultStringForArrayType } from './getResultStringForArrayType';
import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';
import { getResultStringForBooleanType } from './getResultStringForBooleanType';
import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';
import { getResultStringForExportInterface } from './getResultStringForExportInterface';
import { getResultStringForNumberType } from './getResultStringForNumberType';
import { getResultStringForStringType } from './getResultStringForStringType';
import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';
import { getStandardString } from './getStandardString';
import { getResultStringForAdditionalPropertiesType } from './getResultStringForAdditionalPropertiesType';
import { getResultStringForInvalidSchemaProperties } from './getResultStringForInvalidSchemaProperties';

jest.mock('./getResultStringForAdditionalPropertiesType', () => ({
    getResultStringForAdditionalPropertiesType: jest.fn(),
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
jest.mock('./getResultStringForAdditionalPropertiesType', () => ({
    getResultStringForAdditionalPropertiesType: jest.fn(),
}));
jest.mock('./getResultStringForInvalidSchemaProperties', () => ({
    getResultStringForInvalidSchemaProperties: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

const defaultProps = {
    $ref: undefined,
    additionalProperties: undefined,
    description: undefined,
    format: undefined,
    exclusiveMaximum: undefined,
    exclusiveMinimum: undefined,
    items: undefined,
    maxItems: undefined,
    maxLength: undefined,
    maximum: undefined,
    minItems: undefined,
    minLength: undefined,
    minimum: undefined,
    nullable: false,
    oneOf: undefined,
    propertyName: undefined,
    type: undefined,
    uniqueItems: undefined,
    xDictionaryKey: undefined,
};

describe(`convertToTypesFromSchemaProperties`, () => {
    it(`should call getResultStringForStringType when property has type string`, () => {
        const schema = { properties: { propertyName: { type: 'string' } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForStringType).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'string',
        });
    });

    it(`should call getResultStringForNumberType when property has type number`, () => {
        const schema = { properties: { propertyName: { type: 'number' } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForNumberType).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'number',
        });
    });

    it(`should call getResultStringForBooleanType when property has type boolean`, () => {
        const schema = { properties: { propertyName: { type: 'boolean' } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForBooleanType).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'boolean',
        });
    });

    it(`should call getResultStringForArrayType when property has type array with items that have $ref`, () => {
        const schema = {
            properties: {
                propertyName: {
                    type: 'array',
                    items: { $ref: 'path/to/ref' },
                },
            },
        };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForArrayType).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'array',
            refType: ['path', 'to', 'ref'],
            items: {
                $ref: 'path/to/ref',
            },
        });
    });

    it(`should call getResultStringForArrayWithoutItemRef when property has type array with items without $ref`, () => {
        const schema = {
            properties: {
                propertyName: {
                    type: 'array',
                    items: {},
                },
            },
        };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForArrayWithoutItemRef).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'array',
            items: {},
        });
    });

    it(`should call getStandardString when property has oneOf array`, () => {
        const schema = { properties: { propertyName: { type: 'array', oneOf: [{ $ref: 'path/to/ref' }] } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getStandardString).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'array',
            isArray: false,
            refType: ['path', 'to', 'ref'],
            oneOf: [
                {
                    $ref: 'path/to/ref',
                },
            ],
        });
    });

    it(`should call getStandardString when property has $ref`, () => {
        const schema = { properties: { propertyName: { $ref: 'path/to/ref' } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getStandardString).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            refType: ['path', 'to', 'ref'],
            $ref: 'path/to/ref',
            isArray: false,
        });
    });

    it(`should call getResultStringForUndefinedTypeRefAndOneOf when property has undefined type, ref and oneOf`, () => {
        const schema = { properties: { propertyName: { $ref: undefined, type: undefined, oneOf: undefined } } };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForUndefinedTypeRefAndOneOf).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
        });
    });

    it(`should call getResultStringForDictionaryKey when property has`, () => {
        const schema = {
            properties: {
                propertyName: {
                    type: 'object',
                    'x-dictionaryKey': { $ref: 'path/to/ref' },
                    additionalProperties: { $ref: 'path/to/ref' },
                },
            },
        };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForDictionaryKey).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'object',
            xDictionaryKey: {
                $ref: 'path/to/ref',
            },
            additionalProperties: {
                $ref: 'path/to/ref',
            },
        });
    });

    it(`should call getResultStringForAdditionalPropertiesType when property has`, () => {
        const schema = {
            properties: {
                propertyName: {
                    type: 'object',
                    additionalProperties: { type: 'array' },
                },
            },
        };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForAdditionalPropertiesType).toHaveBeenCalledWith({
            ...defaultProps,
            propertyName: 'propertyName',
            type: 'object',
            additionalProperties: {
                type: 'array',
            },
        });
    });

    it(`should call getResultStringForInvalidSchemaProperties when property has invalid type`, () => {
        const schema = {
            properties: { propertyName: { type: 'any-other-type' } },
        };
        const props = {
            schema,
            schemaKey: 'TypeWithId',
            interfaces: undefined,
        };

        convertToTypesFromSchemaProperties(props);

        expect(getResultStringForExportInterface).toHaveBeenCalledWith(props);
        expect(getResultStringForInvalidSchemaProperties).toHaveBeenCalledWith({
            ...defaultProps,
            type: 'any-other-type',
            propertyName: 'propertyName',
            errorMessage: 'Invalid schema properties',
        });
    });
});
