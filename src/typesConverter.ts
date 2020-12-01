import {
    DataTypes,
    NumberAdditionalProps,
    ResultStringPropsForNumberType,
    ResultStringProps,
    StringAdditionalProps,
    ResultStringPropsForStringType,
    ResultStringPropsForArrayType,
    ArrayAdditionalProps,
    SwaggerProps,
    SwaggerSchema,
    ParseProps,
    ConvertToTypesProps,
    GetSchemasProps,
} from './types';
import { getSchemaProperties, getSchemas, writeToFile } from './shared';

const parseFormat = (format?: string): string => (format ? `format: "${format}"` : '');
const parseRefType = (refType: string[]): string => refType[refType.length - 1];
const parsePropertyName = ({ propertyName, nullable, type }: any): string =>
    `    ${propertyName}${nullable ? '?' : ''}: ${type};`;

const parseProperty = ({
    propertyName,
    description,
    nullable,
}: {
    propertyName: string;
    description?: string;
    nullable: boolean;
}): string => {
    return `${getDescription(description)}    ${propertyName}${nullable ? '?' : ''}: `;
};

const getResultStringForNumberType = ({
    propertyName,
    description,
    nullable,
    format,
    minimum,
    maximum,
    exclusiveMinimum,
    exclusiveMaximum,
}: ResultStringPropsForNumberType): string => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: 'number' });
    const formatString = parseFormat(format);
    const minimumString = minimum ? `${format ? '; ' : ''}${NumberAdditionalProps.Minimum}: ${minimum}` : '';
    const maximumString = maximum ? `${format || minimum ? '; ' : ''}${NumberAdditionalProps.Maximum}: ${maximum}` : '';
    const exclusiveMinimumString = exclusiveMinimum
        ? `${format || minimum || maximum ? '; ' : ''}${NumberAdditionalProps.ExclusiveMinimum}: ${exclusiveMinimum}`
        : '';
    const exclusiveMaximumString = exclusiveMaximum
        ? `${format || minimum || maximum || exclusiveMinimum ? '; ' : ''}${
              NumberAdditionalProps.ExclusiveMaximum
          }: ${exclusiveMaximum}`
        : '';

    const shouldShowDocs = format || minimum || maximum || exclusiveMinimum || exclusiveMaximum;

    const documentation = `${formatString}${minimumString}${maximumString}${exclusiveMinimumString}${exclusiveMaximumString}`;

    return `${getDescription(description)}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};

const getResultStringForBooleanType = ({ propertyName, description, nullable }: ResultStringProps): string => {
    const nameAndValue = `    ${propertyName}${nullable ? '?' : ''}: boolean;`;

    return `${getDescription(description)}${nameAndValue}\n`;
};

const getDescription = (description?: string) => `${description ? `/**\n * ${description} \n */\n` : ''}`;

const getResultStringForStringType = ({
    propertyName,
    description,
    nullable,
    format,
    minLength,
    maxLength,
}: ResultStringPropsForStringType): string => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: 'string' });
    const formatString = parseFormat(format);
    const minString = minLength ? `${format ? '; ' : ''}${StringAdditionalProps.MinLength}: ${minLength}` : '';
    const maxString = maxLength
        ? `${format || minLength ? '; ' : ''}${StringAdditionalProps.MaxLength}: ${maxLength}`
        : '';

    const shouldShowDocs = format || minLength || maxLength;

    const documentation = `${formatString}${minString}${maxString}`;

    return `${getDescription(description)}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};

const getResultStringForArrayType = ({
    propertyName,
    description,
    nullable,
    refType,
    format,
    minItems,
    maxItems,
    uniqueItems,
}: ResultStringPropsForArrayType): string => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: `${parseRefType(refType)}[]` });
    const formatString = parseFormat(format);
    const minItemsString = minItems ? `${format ? '; ' : ''}${ArrayAdditionalProps.MinItems}: ${minItems}` : '';
    const maxItemsString = maxItems
        ? `${format || minItems ? '; ' : ''}${ArrayAdditionalProps.MaxItems}: ${maxItems}`
        : '';
    const uniqueItemsString = uniqueItems
        ? `${format || minItems || maxItems ? '; ' : ''}${ArrayAdditionalProps.UniqueItems}: ${uniqueItems}`
        : '';

    const shouldShowDocs = format || minItems || maxItems || uniqueItems;
    const documentation = `${formatString}${minItemsString}${maxItemsString}${uniqueItemsString}`;

    return `${getDescription(description)}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};

const convertToTypesFromSchemaProperties = ({
    schema,
    schemaKey,
    interfaces,
}: {
    schema: SwaggerSchema;
    schemaKey?: string;
    interfaces?: Array<string>;
}): string => {
    const getStandardString = ({ propertyName, description, nullable, refType, format, isArray }: any) => {
        return `${parseProperty({ propertyName, description, nullable })}${parseRefType(refType)}${
            isArray ? '[]' : ''
        };${parseFormat(format)}\n`;
    };

    let result = `${getDescription(schema.description)}export interface ${schemaKey}${
        interfaces ? ` extends ${interfaces.join(', ')} ` : ' '
    }{\n`;

    if (schema.properties) {
        getSchemaProperties(schema.properties).map(
            ({
                propertyName,
                description,
                $ref,
                items,
                type,
                nullable,
                format,
                maxLength,
                minLength,
                oneOf,
                minimum,
                maximum,
                exclusiveMinimum,
                exclusiveMaximum,
                minItems,
                maxItems,
                uniqueItems,
                xDictionaryKey,
                additionalProperties,
            }) => {
                if (type === DataTypes.String) {
                    result += getResultStringForStringType({
                        propertyName,
                        description,
                        nullable,
                        format,
                        minLength,
                        maxLength,
                    });
                }

                if (type === DataTypes.Integer || type === DataTypes.Number) {
                    result += getResultStringForNumberType({
                        propertyName,
                        description,
                        nullable,
                        format,
                        minimum,
                        maximum,
                        exclusiveMinimum,
                        exclusiveMaximum,
                    });
                }

                if (type === DataTypes.Boolean) {
                    result += getResultStringForBooleanType({ propertyName, description, nullable });
                }

                if (type === DataTypes.Array && items) {
                    if (items[SwaggerProps.$ref]) {
                        const refType = items[SwaggerProps.$ref].split('/');

                        result += getResultStringForArrayType({
                            propertyName,
                            description,
                            nullable,
                            refType,
                            format,
                            uniqueItems,
                            maxItems,
                            minItems,
                        });
                    } else {
                        const shouldShowBrackets = items.oneOf && items.oneOf.type ? '' : '[]';

                        let type = '';

                        if (items.oneOf) {
                            type = parseRefType(items.oneOf[0][SwaggerProps.$ref].split('/'));
                        } else {
                            const swaggerType = items[SwaggerProps.Type];
                            if (swaggerType === 'integer') {
                                type = 'number';
                            } else {
                                type = swaggerType;
                            }
                        }

                        result += `${parseProperty({
                            propertyName,
                            description,
                            nullable,
                        })}${type}${shouldShowBrackets};${parseFormat(format)}${
                            maxItems ? ` // maxItems: ${maxItems}` : ''
                        }\n`;
                    }
                }

                if (oneOf && Array.isArray(oneOf) && oneOf[0][SwaggerProps.$ref]) {
                    const refType = oneOf[0][SwaggerProps.$ref].split('/');
                    result += getStandardString({
                        propertyName,
                        description,
                        nullable,
                        refType,
                        format,
                        isArray: false,
                    });
                }

                if ($ref) {
                    const refType = $ref.split('/');
                    result += getStandardString({
                        propertyName,
                        nullable,
                        refType,
                        format,
                        isArray: false,
                    });
                }

                if (!type && !$ref && !oneOf) {
                    result += `    ${propertyName}${nullable ? '?' : ''}: any;\n`;
                }

                // Dictionary type
                if (xDictionaryKey && additionalProperties) {
                    // Enum keys and Enum/Object values
                    if (xDictionaryKey[SwaggerProps.$ref] && additionalProperties[SwaggerProps.$ref]) {
                        const dictionaryRef = parseRefType(xDictionaryKey[SwaggerProps.$ref].split('/'));
                        const additionalRef = parseRefType(additionalProperties[SwaggerProps.$ref].split('/'));

                        result += `${getDescription(description)}    ${propertyName}: {\n[key in ${dictionaryRef}]: ${additionalRef}; \n }; \n`;

                        // Enum keys and Boolean values
                    } else if (xDictionaryKey[SwaggerProps.$ref]) {
                        if (additionalProperties.type && additionalProperties.type === DataTypes.Boolean) {
                            const dictionaryRef = parseRefType(xDictionaryKey[SwaggerProps.$ref].split('/'));

                            result += `${getDescription(description)}    ${propertyName}: {\n[key in ${dictionaryRef}]: boolean; \n }; \n`;
                        }
                    } else {
                        result += ' "// TODO: Something in wrong" ';
                    }
                }
            },
        );
    }

    result += '}\n';

    return result;
};

export const parseObject = ({ schema, schemaKey }: { schema: any; schemaKey: string }) => {
    if (schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf])) {
        const interfacesNames = schema[SwaggerProps.AllOf]
            .filter((e: { $ref?: string }) => e[SwaggerProps.$ref])
            .map((obj: any) => {
                const refType = obj[SwaggerProps.$ref].split('/');
                return parseRefType(refType);
            });

        const obj = schema[SwaggerProps.AllOf].find((schema: any) => schema.type);

        return convertToTypesFromSchemaProperties({ schemaKey, schema: obj, interfaces: interfacesNames });
    } else {
        return convertToTypesFromSchemaProperties({ schemaKey, schema });
    }
};

/**
 * Converts object: {type: ... , enum: ['one', 'two', 'three']}
 * to "export type ${name} = 'one' | 'two' | 'three';"
 */
export const parseEnum = ({ schema, schemaKey }: ParseProps): string => {
    const description = schema.description;

    let result = `${description ? `/**\n * ${description} \n */\n` : ''}export type ${schemaKey} = `;

    const enums = schema.enum;
    const len = enums.length;
    for (let i = 0; i < len; i++) {
        result += `\'${enums[i]}\'${i !== len - 1 ? ' | ' : ';'}`;
    }
    result += '\n';

    return result;
};

export const parseSchemas = ({ json, swaggerVersion, overrideSchemas }: GetSchemasProps) => {
    const schemas = getSchemas({ json, swaggerVersion });

    if (schemas) {
        const schemasKeys = Object.keys(schemas);

        let result = '';
        schemasKeys.map(schemaKey => {
            try {
                const schema = schemas[schemaKey];
                /**
                 * Is schema is a simple object or is it extends from another schema
                 */
                if (schema[SwaggerProps.Type] === DataTypes.Object || schema[SwaggerProps.AllOf]) {
                    result += parseObject({ schema, schemaKey });
                } else if (schema.type === DataTypes.String) {
                    /**
                     * Check if current schema is override
                     */
                    if (overrideSchemas?.length && overrideSchemas.find(e => e[schemaKey])) {
                        // for TS happiness
                        const overrideSchema = overrideSchemas.find(e => e[schemaKey]);
                        if (overrideSchema) {
                            result += parseEnum({ schema: overrideSchema[schemaKey], schemaKey });
                        }
                    } else {
                        result += parseEnum({ schema, schemaKey });
                    }
                } else {
                    result += `// TODO: ERROR! Something wrong with ${schemaKey} \n`;
                }
            } catch (error) {
                result += `// TODO: ERROR! Something wrong with ${schemaKey} \n`;
            }
        });

        result += ` \n`;
        return result;
    } else {
        return 'ERROR! Check provided swagger version.';
    }
};

export const convertToTypes = ({
    json,
    fileName,
    folderPath,
    swaggerVersion,
    overrideSchemas,
}: ConvertToTypesProps) => {
    const resultString = parseSchemas({ json, swaggerVersion, overrideSchemas });
    writeToFile({
        folderPath,
        fileName,
        resultString,
    });
};
