import { ParseProps } from '../types';

/**
 * Converts object: {type: ... , enum: ['one', 'two', 'three']}
 * to "export type ${name} = 'one' | 'two' | 'three';"
 */
export const parseEnum = ({ schema, schemaKey }: ParseProps): string => {
    const description = schema.description;

    let result = `${description ? `/**\n * ${description}\n */\n` : ''}export type ${schemaKey} = `;

    const enums = schema.enum;
    const len = enums.length;
    for (let i = 0; i < len; i++) {
        result += `\'${enums[i]}\'${i !== len - 1 ? ' | ' : ';'}`;
    }
    result += '\n';

    return result;
};
