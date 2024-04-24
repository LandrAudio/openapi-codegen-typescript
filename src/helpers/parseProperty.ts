import { SchemaProperties } from '../types';
import { getDescription } from './getDescription';

export const parseProperty = ({
    propertyName,
    description,
    nullable,
}: Pick<SchemaProperties, 'propertyName' | 'description' | 'nullable'>): string => {
    return `${getDescription({ description })}\t${propertyName}${nullable ? '?' : ''}: `;
};
