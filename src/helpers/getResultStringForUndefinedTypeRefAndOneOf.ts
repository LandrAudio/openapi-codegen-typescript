import { SchemaProperties } from '../types';

export const getResultStringForUndefinedTypeRefAndOneOf = ({
    propertyName,
    nullable,
}: Pick<SchemaProperties, 'propertyName' | 'nullable'>) => {
    return `    ${propertyName}${nullable ? '?' : ''}: any;\n`;
};
