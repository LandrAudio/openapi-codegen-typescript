import { DataTypes, SwaggerProps, ConvertToTypesProps, GetSchemasProps } from './types';
import { getSchemas, isSwaggerV2, writeToFile } from './shared';
import { parseObject } from './helpers/parseObject';
import { parseEnum } from './helpers/parseEnum';

export const parseSchemas = ({ json, overrideSchemas }: GetSchemasProps) => {
    const schemas = getSchemas({ json });

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
                    /**
                     * Sometimes in swagger v2 schema key could be named as SomeDto[AnotherDto]
                     */
                    if (isSwaggerV2(json) && schemaKey.includes('[') && schemaKey.includes(']')) {
                        const strings = schemaKey.split('[');
                        result += parseObject({ schema, schemaKey: strings[0] });
                    } else {
                        result += parseObject({ schema, schemaKey });
                    }
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
                    result += `// Error: Unsupported schema for ${schemaKey}\n`;
                }
            } catch (error) {
                result += `// Error: Unhandled error with ${schemaKey}\n`;
            }
        });

        result += `\n`;
        return result;
    } else {
        return 'ERROR! Check provided swagger version.';
    }
};

export const convertToTypes = ({ json, fileName, folderPath, overrideSchemas }: ConvertToTypesProps) => {
    const resultString = parseSchemas({ json, overrideSchemas });
    writeToFile({
        folderPath,
        fileName,
        resultString,
    });
};
