import {
    ConvertToMocksProps,
    DataTypes,
    GetSchemasProps,
    MockArrayProps,
    PropertyNames,
    StringFormats,
    SwaggerProps,
} from './types';
import { getSchemaProperties, getSchemas, hashedString, writeToFile } from './shared';
import casual from 'casual';

const parseRefType = (refType: string[]): string => refType[refType.length - 1];

const getVariables = (varNamesAndValues: Array<MockArrayProps>) =>
    varNamesAndValues.map((mock: MockArrayProps) => `  ${mock.propertyName}: ${mock.value},`).join('\n');

const isAn = (word: string) => {
    const symbol = word[0].toLowerCase();
    const isAn =
        symbol === 'a' || symbol === 'e' || symbol === 'i' || symbol === 'o' || symbol === 'y' || symbol === 'u';

    return isAn ? 'an' : 'a';
};

const getMockTemplateString = ({ typeName, varNamesAndValues }: any) => `
export const ${isAn(typeName)}${typeName}API = (overrides?: Partial<${typeName}>): ${typeName} => {
  return {
  ${getVariables(varNamesAndValues)}
  ...overrides,
  };
};
`;

function getStringFakeValue({
    name,
    propertyName,
    format,
    minLength,
    maxLength,
}: {
    name: string;
    propertyName: string;
    format: string;
    minLength: number;
    maxLength: number;
}) {
    casual.seed(hashedString(name + propertyName));

    let value;

    if (!format) {
        // simple string
        value = `'${propertyName}-${name.toLowerCase()}'`;
    } else if (format === StringFormats.Guid || propertyName === PropertyNames.Id) {
        value = `'${casual.uuid}'`;
    } else if (format === StringFormats.DateTime || format === StringFormats.TimeSpan) {
        value = `'2019-06-10T06:20:01.389Z'`;
    } else if (format === StringFormats.Date) {
        value = `'2019-06-10'`;
    } else if (format === StringFormats.Email) {
        value = `'${casual.email}'`;
    }

    if (!value) {
        value = 'TODO: FIX';
    }

    return value;
}

const getIsSchemaContainsAllOfArray = (schema:any) => {
    return schema && schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf]);
}

/**
 * Get all interfaces that this schema exteds
 * @param schema DTO schema
 * @param DTOs all DTOs
 */
export const getSchemaInterfaces = (schema: any, DTOs: any): Array<string> | undefined => {

    if (getIsSchemaContainsAllOfArray(schema)) {
        const result = [] as Array<string>;

        schema[SwaggerProps.AllOf]
            .filter((e: { $ref?: string }) => e[SwaggerProps.$ref])
            .forEach((obj: any) => {
                const refType = obj[SwaggerProps.$ref].split('/');
                /*
                Example: will return InviteMembersRequestDto
                if "SomeDTo extends InviteMembersRequestDto"
                 */
                const parsedRefType = parseRefType(refType);

                // Repeat "getSchemaInterfaces" in cycle for inner interfaces
                const newSchema = DTOs[parsedRefType];
                if (getIsSchemaContainsAllOfArray(newSchema)) {
                    getSchemaInterfaces(newSchema, DTOs)?.forEach(b => {
                        result.push(b);
                    });
                } else {
                    if (newSchema) {
                        result.push(parsedRefType);
                    }
                }

                result.push(parsedRefType);
            });

        return result;
    } else {
        return undefined;
    }
};

interface CombinePropertiesProps {
    schema: any;
    schemas: any;
    interfaces: Array<string>;
}

/**
 * Combines all properties from extended DTOs into one object.
 *
 * @param schema
 * @param schemas
 * @param interfaces
 */
export const combineProperties = ({ schema, schemas, interfaces }: CombinePropertiesProps) => {
    let properties = Object.assign({}, schema.properties);

    interfaces.forEach((interfaceName: string) => {
        const dto = schemas[interfaceName];

        if (dto && dto.properties) {
            properties = Object.assign(properties, dto.properties);
        }

        if (dto && dto[SwaggerProps.AllOf] && dto[SwaggerProps.AllOf][1].properties) {
            properties = Object.assign(properties, dto[SwaggerProps.AllOf][1].properties);
        }
    });

    schema.properties = properties;
    return Object.assign({}, schema);
};

export const convertRefType = ({
    propertyName,
    ref,
    isArray = false,
}: {
    propertyName: string;
    ref: any;
    isArray?: boolean;
}) => {
    if (isArray) {
        return { propertyName, value: ownPropString(propertyName, `[${isAn(ref)}${ref}API()]`) };
    } else {
        return { propertyName, value: ownPropString(propertyName, `${isAn(ref)}${ref}API()`) };
    }
};

const ownPropString = (propName: string, result: string) => {
    return `overrides?.${propName} || ${result}`;
};

interface ParseSchemaProps {
    schema: any;
    /**
     * DTO name
     * Examples: MembersEmailDto, InviteMembersRequestDto, InviteAssetsMembersRequestDto
     */
    name: any;
    /**
     * All parsed DTOs from swagger json file
     */
    DTOs?: any;
}

export const parseSchema = ({ schema, name, DTOs }: ParseSchemaProps) => {

    const parseSwaggerJsonObject = (obj: any, interfaces?: Array<string>): string => {
        if (interfaces) {
            obj = combineProperties({ schema: obj, schemas: DTOs, interfaces });
        }

        let mocks: Array<MockArrayProps> = [];

        if (obj.properties) {
            const schemaProperties = getSchemaProperties(obj.properties);

            schemaProperties.forEach(props => {
                const {
                    propertyName,
                    $ref,
                    items,
                    type,
                    format,
                    maxLength,
                    minLength,
                    oneOf,
                    minimum,
                    maximum,
                } = props;
                casual.seed(hashedString(name + propertyName));

                    if (type === DataTypes.String) {
                        mocks.push({
                            propertyName,
                            value: getStringFakeValue({ name, propertyName, format, minLength, maxLength }),
                        });
                    }

                    if (type === DataTypes.Integer || type === DataTypes.Number) {
                        mocks.push({
                            propertyName,
                            value:
                                type === DataTypes.Integer
                                    ? casual.integer(minimum || 0, maximum || 30)
                                    : casual.double(minimum || 0, maximum || 30),
                        });
                    }

                    if (type === DataTypes.Boolean) {
                        mocks.push({ propertyName, value: true });
                    }

                    if (type === DataTypes.Array && items) {
                        if (items[SwaggerProps.$ref]) {
                            const refType = items[SwaggerProps.$ref].split('/');

                            const ref = parseRefType(refType);

                            const schema = DTOs[ref];
                            if (schema && schema.enum) {
                                mocks.push({ propertyName, value: `['${schema.enum[0]}']` });
                            } else {
                                mocks.push(convertRefType({ propertyName, ref, isArray: true }));
                            }
                        } else {
                            const type = items.oneOf
                                ? parseRefType(items.oneOf[0][SwaggerProps.$ref].split('/'))
                                : items.type;

                            if (items.oneOf) {
                                const schema = DTOs[type];
                                if (schema && schema.enum) {
                                    mocks.push({ propertyName, value: `['${schema.enum[0]}']` });
                                }
                            } else {
                                if (items.type === DataTypes.Number) {
                                    mocks.push({ propertyName, value: `[${casual.double()},${casual.double()}]` });
                                } else {
                                    mocks.push({ propertyName, value: `['${casual.word}']` });
                                }
                            }
                        }
                    }

                    if (oneOf && Array.isArray(oneOf) && oneOf[0][SwaggerProps.$ref]) {
                        const refType = oneOf[0][SwaggerProps.$ref].split('/');

                        const ref = parseRefType(refType);

                        const schema = DTOs[ref];
                        if (schema && schema.enum) {
                            mocks.push({ propertyName, value: `'${schema.enum[0]}'` });
                        } else {
                            mocks.push(convertRefType({ propertyName, ref }));
                        }
                    }

                    if ($ref) {
                        const refType = $ref.split('/');

                        const ref = parseRefType(refType);

                        const schema = DTOs[ref];
                        if (schema && schema.enum) {
                            mocks.push({ propertyName, value: `'${schema.enum[0]}'` });
                        } else if (schema) {
                            mocks.push(convertRefType({ propertyName, ref }));
                        } else {
                            mocks.push({
                                propertyName: `ERROR in ${propertyName} ref:${ref}`,
                                value: 'NULL',
                            });
                        }
                    }
                },
            );
        }

        return getMockTemplateString({ typeName: name, varNamesAndValues: mocks });
    };

    if (schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf])) {

        const interfaces = getSchemaInterfaces(schema, DTOs);

        const object = schema.allOf.find((schema: any) => schema.type);
        return parseSwaggerJsonObject(object, interfaces);
    } else {
        return parseSwaggerJsonObject(schema);
    }
};

export const parseSchemas = ({ json, swaggerVersion }: GetSchemasProps) => {
    const schemas = getSchemas({ json, swaggerVersion });
    const DTOs = Object.keys(schemas);

    let resultString = '';
    DTOs.map(dtoName => {
        try {
            const schema = schemas[dtoName];
            if (schema.type === DataTypes.Object || schema.allOf) {
                const result = parseSchema({
                    schema: schema,
                    name: dtoName,
                    DTOs: schemas,
                });
                resultString += result;
            }
        } catch (error) {
            resultString += `// TODO: ERROR! Something wrong with ${dtoName} \n`;
        }
    });

    resultString += ` \n`;
    return resultString;
};

export const convertToMocks = ({
    json,
    fileName,
    folderPath,
    typesPath,
    swaggerVersion = 3,
}: ConvertToMocksProps): string => {
    const schemas = getSchemas({ json, swaggerVersion });

    const imports = Object.keys(schemas).join(', ');

    const disableNoUse = '/* eslint-disable @typescript-eslint/no-use-before-define */\n';
    const disableNoUsedVars = '/* eslint-disable @typescript-eslint/no-unused-vars */\n';
    const importsDescription = `import {${imports}} from '${typesPath}';\n`;

    const result = parseSchemas({ json, swaggerVersion });
    const resultString = `${disableNoUse}${disableNoUsedVars}${importsDescription}${result}`;
    writeToFile({
        folderPath,
        fileName,
        resultString,
    });

    return resultString;
};
