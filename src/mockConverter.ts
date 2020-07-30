import { ConvertToMocksProps, DataTypes, GetSchemasProps, MockArrayProps, SwaggerProps } from './types';
import { getSchemaProperties, getSchemas, hashedString, writeToFile } from './shared';
import casual from 'casual';
import { MockGenerateHelper } from './MockGenerateHelper';

const getIsSchemaContainsAllOfArray = (schema: any) => {
    return schema && schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf]);
};

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
                const parsedRefType = MockGenerateHelper.parseRefType(refType);

                // Repeat "getSchemaInterfaces" in cycle for inner interfaces
                const newSchema = DTOs[parsedRefType];
                if (getIsSchemaContainsAllOfArray(newSchema)) {
                    getSchemaInterfaces(newSchema, DTOs)?.forEach(b => {
                        result.push(b);
                    });
                } else if (newSchema) {
                    result.push(parsedRefType);
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
    let combinedProperties = {
        ...schema.properties,
    };

    interfaces.forEach((interfaceName: string) => {
        const dto = schemas[interfaceName];

        if (dto) {
            let extendedDtoProps;

            if (dto.properties) {
                extendedDtoProps = dto.properties;
            } else if (dto[SwaggerProps.AllOf] && dto[SwaggerProps.AllOf][1].properties) {
                extendedDtoProps = dto[SwaggerProps.AllOf][1].properties;
            }

            combinedProperties = {
                ...combinedProperties,
                ...extendedDtoProps,
            };
        }
    });

    schema.properties = combinedProperties;
    return {
        ...schema,
    };
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

                const mockGenerator = new MockGenerateHelper(casual);

                if (type === DataTypes.String) {
                    const stringMock = mockGenerator.getStringMock({
                        name,
                        propertyName,
                        format,
                        minLength,
                        maxLength,
                    });
                    mocks.push(stringMock);
                }

                if (type === DataTypes.Integer || type === DataTypes.Number) {
                    const numberMock = mockGenerator.getNumberMock({ propertyName, type, minimum, maximum });
                    mocks.push(numberMock);
                }

                if (type === DataTypes.Boolean) {
                    const boolMock = mockGenerator.getBooleanMock(propertyName);
                    mocks.push(boolMock);
                }

                if (type === DataTypes.Array && items) {
                    const arrayOfItemsMock = mockGenerator.getArrayOfItemsMock({
                        propertyName,
                        items,
                        DTOs,
                    });
                    mocks.push(arrayOfItemsMock);
                }

                if (oneOf && Array.isArray(oneOf) && oneOf[0][SwaggerProps.$ref]) {
                    const arrayOneOf = mockGenerator.getDtoMock({
                        propertyName,
                        oneOf,
                        DTOs,
                    });
                    mocks.push(arrayOneOf);
                }

                if ($ref) {
                    const ref = mockGenerator.getRefTypeMock({ $ref, propertyName, DTOs });
                    mocks.push(ref);
                }
            });
        }

        return MockGenerateHelper.getMockTemplateString({ typeName: name, varNamesAndValues: mocks });
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
    DTOs.forEach(dtoName => {
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
