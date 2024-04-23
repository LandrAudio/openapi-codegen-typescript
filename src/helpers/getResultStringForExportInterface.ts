import { SwaggerSchema } from '../types';
import { getDescription } from './getDescription';

export type ResultStringForExportInterface = {
    schemaKey?: string;
    schema: SwaggerSchema;
    interfaces?: Array<string>;
};

export const getResultStringForExportInterface = ({ schemaKey, schema, interfaces }: ResultStringForExportInterface) =>
    `${getDescription({ description: schema?.description })}export interface ${schemaKey}${
        interfaces ? ` extends ${interfaces.join(', ')} ` : ' '
    }{\n`;
