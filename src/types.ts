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

export type ResultStringProps = Pick<SchemaProperties, 'propertyName' | 'description' | 'nullable'>;

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

export type ResultStringPropsForNumberType = Pick<
    SchemaProperties,
    | 'description'
    | 'propertyName'
    | 'nullable'
    | 'format'
    | 'minimum'
    | 'maximum'
    | 'exclusiveMinimum'
    | 'exclusiveMaximum'
>;

export interface ResultStringPropsForArrayType
    extends Pick<
        SchemaProperties,
        'propertyName' | 'description' | 'nullable' | 'format' | 'minItems' | 'maxItems' | 'uniqueItems'
    > {
    refType: string[];
}

export type ResultStringPropsForStringType = Pick<
    SchemaProperties,
    'propertyName' | 'description' | 'nullable' | 'format' | 'minLength' | 'maxLength'
>;

export type ResultStringForAdditionalPropertiesType = Pick<
    SchemaProperties,
    'additionalProperties' | 'xDictionaryKey' | 'description' | 'propertyName'
>;

export type ResultStringForArrayWithoutItemRef = Pick<
    SchemaProperties,
    'items' | 'propertyName' | 'description' | 'nullable' | 'format' | 'maxItems'
>;

export interface DictionaryValueResultString extends Pick<SchemaProperties, 'description' | 'propertyName'> {
    value: string;
    dictionaryRef: string;
}
export interface InvalidSchemaProperties extends Pick<SchemaProperties, 'propertyName'> {
    errorMessage: string;
}

export type ResultStringForDictionaryKey = Pick<
    SchemaProperties,
    'xDictionaryKey' | 'additionalProperties' | 'description' | 'propertyName'
>;

export interface MockArrayProps extends PropertyNameProp {
    value: any;
}

export interface GetStringMockProps extends PropertyNameProp {
    name: string;
    format: string;
}

export interface GetNumberMockProps extends PropertyNameProp {
    type: DataTypes.Integer | DataTypes.Number;
    minimum?: number;
    maximum?: number;
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

export interface GetAdditionalPropertiesProps extends PropertyNameProp {
    propertyName: string;
    additionalProperties: { type: string };
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
        [key: string]: any;
    };
}

export interface ConvertRefType extends PropertyNameProp {
    /**
     * Reference to another object DTO
     */
    ref: string;
    isArray?: boolean;
}

export type SchemaProperties = {
    $ref: any;
    additionalProperties: any;
    description: string | undefined;
    exclusiveMinimum?: boolean;
    exclusiveMaximum?: boolean;
    format: string;
    items: any;
    maxItems?: number;
    maxLength?: number;
    maximum?: number;
    minItems?: number;
    minLength?: number;
    minimum?: number;
    nullable: boolean;
    oneOf: any;
    propertyName: string;
    type: string;
    uniqueItems?: boolean;
    xDictionaryKey?: any;
};
