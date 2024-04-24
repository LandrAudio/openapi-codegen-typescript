import { SwaggerProps, SwaggerSchema } from '../types';
import { convertToTypesFromSchemaProperties } from './convertToTypesFromSchemaProperties';
import { parseRefType } from './parseRefType';

export type ParseObjectProps = { schema: any; schemaKey: string };

export const parseObject = ({ schema, schemaKey }: ParseObjectProps) => {
    if (schema[SwaggerProps.AllOf] && Array.isArray(schema[SwaggerProps.AllOf])) {
        const interfacesNames = schema[SwaggerProps.AllOf]
            .filter((e: { $ref?: string }) => e[SwaggerProps.$ref])
            .map((obj: any) => {
                const refType = obj[SwaggerProps.$ref].split('/');
                return parseRefType(refType);
            });

        const obj: SwaggerSchema = schema[SwaggerProps.AllOf].find((schema: any) => schema.type);

        return convertToTypesFromSchemaProperties({ schemaKey, schema: obj, interfaces: interfacesNames });
    } else {
        return convertToTypesFromSchemaProperties({ schemaKey, schema });
    }
};
