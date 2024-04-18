import { SchemaProperties } from '../types';

export const getResultStringForUndefinedTypeRefAndOneOf = ({
    propertyName,
    nullable,
}: Pick<SchemaProperties, 'propertyName' | 'nullable'>) => {
    return `\t${propertyName}${nullable ? '?' : ''}: any;\n`;
};
