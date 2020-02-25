export enum PropertyNames {
    Id = 'id',
}

export enum SwaggerProps {
    $ref = '$ref',
    OneOf = 'oneOf',
    AllOf = 'allOf',
    Type = 'type',
}

export enum DataTypes {
    String = 'string',
    Number = 'number',
    Integer = 'integer',
    Boolean = 'boolean',
    Array = 'array',
    Object = 'object',
}

export enum StringFormats {
    Date = 'date',
    DateTime = 'date-time',
    Password = 'password',
    Byte = 'byte',
    Binary = 'binary',
    Email = 'email',
    Guid = 'guid',
    Uri = 'uri',
    Hostname = 'hostname',
    Ipv4 = 'ipv4',
    Ipv6 = 'ipv6',
}

export enum StringAdditionalProps {
    MinLength = 'minLength',
    MaxLength = 'maxLength',
}

export enum NumberAdditionalProps {
    Minimum = 'minimum',
    Maximum = 'maximum',
    ExclusiveMinimum = 'exclusiveMinimum',
    ExclusiveMaximum = 'exclusiveMaximum',
    multipleOf = 'multipleOf',
}

export enum ArrayAdditionalProps {
    MinItems = 'minItems',
    MaxItems = 'maxItems',
    UniqueItems = 'uniqueItems',
}

export interface ResultStringProps {
    propertyName: string;
    nullable?: boolean;
}

export interface ConvertToTypesProps {
    json: any;
    fileName: string;
    folderPath: string;
    swaggerVersion: number;
}

export interface ConvertToMocksProps {
    json: any;
    fileName: string;
    folderPath: string;
    typesPath: string;
    swaggerVersion: number;
}

export interface GetSchemasProps {
    json: { components?: { schemas?: any }; definitions?: any };
    swaggerVersion?: number;
}

export interface ResultStringPropsForNumberType extends ResultStringProps {
    format?: string;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
}

export interface ResultStringPropsForArrayType extends ResultStringProps {
    format?: string;
    refType: string[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}

export interface ResultStringPropsForStringType extends ResultStringProps {
    format?: string;
    minLength?: number;
    maxLength?: number;
}

export interface MockArrayProps {
    propertyName: string;
    value: any;
}

export interface ParseProps {
    schema: any;
    schemaKey: string;
}

export interface SwaggerSchema {
    description?: string;
    properties?: {
        type?: string;
    };
}

export interface Props {
    swaggerJsonUrl: string;
    /**
     * Example: './src/types'
     */
    folderPath: string;
    /**
     * Example: swagger-profiles
     */
    fileName: string;
    shouldGenerateMocks?: boolean;
}
