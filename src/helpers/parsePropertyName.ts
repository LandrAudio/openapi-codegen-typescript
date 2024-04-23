import { SchemaProperties } from '../types';

export const parsePropertyName = ({
    propertyName,
    nullable,
    type,
}: Pick<SchemaProperties, 'propertyName' | 'type' | 'nullable'>): string =>
    `    ${propertyName}${nullable ? '?' : ''}: ${type};`;
