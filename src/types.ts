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
    Duration = 'duration',
    Password = 'password',
    Byte = 'byte',
    Binary = 'binary',
    Email = 'email',
    Guid = 'guid',
    Uri = 'uri',
    Hostname = 'hostname',
    Ipv4 = 'ipv4',
    Ipv6 = 'ipv6',
    TimeSpan = 'time-span',
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

export interface PropertyNameProp {
    /**
     * DTO\'s property name
     */
    propertyName: string;
}

export interface ResultStringProps extends PropertyNameProp {
    nullable?: boolean;
    description?: string;
}

export interface EnumProps {
    type: string;
    description: string;
    enum: Array<string>;
    'x-enumNames'?: Array<string>;
}

export interface EnumSchema {
    [key: string]: EnumProps;
}

export interface ConvertToTypesProps {
    json: any;
    fileName: string;
    folderPath: string;
    overrideSchemas?: Array<EnumSchema>;
}

export interface ConvertToMocksProps {
    json: SwaggerV2 | SwaggerV3;
    fileName: string;
    folderPath: string;
    typesPath: string;
    overrideSchemas?: Array<EnumSchema>;
}

export interface SwaggerV2 {
    swagger: '2.0'; // "2.0"
    definitions?: any;
}

export interface SwaggerV3 {
    openapi: '3.0.0'; // "3.0.0",
    components?: { schemas?: any };
}

export interface GetSchemasProps {
    json: SwaggerV2 | SwaggerV3;
    overrideSchemas?: Array<EnumSchema>;
}

export interface ResultStringPropsForNumberType extends ResultStringProps {
    format?: string;
    description?: string;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
}

export interface ResultStringPropsForArrayType extends ResultStringProps {
    format?: string;
    description?: string;
    refType: string[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}

export interface ResultStringPropsForStringType extends ResultStringProps {
    format?: string;
    description?: string;
    minLength?: number;
    maxLength?: number;
}

export interface MockArrayProps extends PropertyNameProp {
    value: any;
}

export interface GetStringMockProps extends PropertyNameProp {
    name: string;
    format: string;
    minLength: number;
    maxLength: number;
}

export interface GetNumberMockProps extends PropertyNameProp {
    type: DataTypes.Integer | DataTypes.Number;
    minimum: number;
    maximum: number;
}

export interface GetArrayOfItemsMockProps extends PropertyNameProp {
    items: any;
    DTOs: any;
}

export interface GetArrayOfOneOfMockProps extends PropertyNameProp {
    oneOf: any;
    DTOs: any;
    overrideSchemas?: Array<EnumSchema>;
}

export interface GetDictionaryMockProps extends PropertyNameProp {
    propertyName: string;
    xDictionaryKey: any;
    additionalProperties: any;
    DTOs: any;
    overrideSchemas?: Array<EnumSchema>;
}

export interface GetRefTypeMockProps extends PropertyNameProp {
    $ref: string;
    DTOs: any;
    overrideSchemas?: Array<EnumSchema>;
}

export interface ParseProps {
    schema: EnumProps;
    schemaKey: string;
}

export interface SwaggerSchema {
    description?: string;
    properties?: {
        type?: string;
    };
}

export interface ConvertRefType extends PropertyNameProp {
    /**
     * Reference to another object DTO
     */
    ref: string;
    isArray?: boolean;
}
