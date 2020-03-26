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

    if (!format) {
        return `'${propertyName}-${name.toLowerCase()}'`;
    } else if (format === StringFormats.Guid || propertyName === PropertyNames.Id) {
        return `'${casual.uuid}'`;
    } else {
        switch (format) {
            case StringFormats.DateTime: {
                return `'2019-06-10T06:20:01.389Z'`;
            }
            case StringFormats.Date: {
                return `'2019-06-10'`;
            }
        }
    }
}

export const getSchemaInterfaces = (schema: any): Array<string> | undefined => {
    if (schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf])) {
        return schema[SwaggerProps.AllOf]
            .filter((e: { $ref?: string }) => e[SwaggerProps.$ref])
            .map((obj: any) => {
                const refType = obj[SwaggerProps.$ref].split('/');
                return parseRefType(refType);
            });
    } else {
        return undefined;
    }
};

export const combineProperties = ({ schema, schemas, interfaces }: any) => {
    if (interfaces) {
        let properties = Object.assign({}, schema.properties);
        interfaces.map((interfaceName: string) => {
            const dto = schemas[interfaceName];
            if (dto && dto.properties) {
                properties = Object.assign(properties, dto.properties);
            }
        });

        schema.properties = properties;
        return Object.assign({}, schema);
    } else {
        return schema;
    }
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

export const parseSchema = ({ schema, name, DTOs }: { schema: any; name: any; DTOs?: any }) => {
    const parseSwaggerJsonObject = (obj: any, interfaces?: Array<string>): string => {
        obj = combineProperties({ schema: obj, schemas: DTOs, interfaces });

        let mocks: Array<MockArrayProps> = [];

        if (obj.properties) {
            getSchemaProperties(obj.properties).map(
                ({ propertyName, $ref, items, type, format, maxLength, minLength, oneOf, minimum, maximum }) => {
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
        const interfaces = getSchemaInterfaces(schema);

        return parseSwaggerJsonObject(
            schema.allOf.find((schema: any) => schema.type),
            interfaces,
        );
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
