import { SwaggerSchema } from '../types';
import { getDescription } from './getDescription';

export const getResultStringForExportInterface = ({
    schemaKey,
    schema,
    interfaces,
}: {
    schemaKey?: string;
    schema: SwaggerSchema;
    interfaces?: Array<string>;
}) =>
    `${getDescription({ description: schema?.description })}export interface ${schemaKey}${
        interfaces ? ` extends ${interfaces.join(', ')} ` : ' '
    }{\n`;
