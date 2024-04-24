import { InvalidSchemaProperties } from '../types';

export const getResultStringForInvalidSchemaProperties = ({ propertyName, errorMessage }: InvalidSchemaProperties) =>
    `// Error: ${errorMessage} for property: ${propertyName}\n`;
