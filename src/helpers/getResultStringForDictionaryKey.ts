import { ResultStringForDictionaryKey, SwaggerProps } from '../types';
import { getDescription } from './getDescription';
import { parseRefType } from './parseRefType';

export const getResultStringForDictionaryKey = ({
    xDictionaryKey,
    additionalProperties,
    description,
    propertyName,
}: ResultStringForDictionaryKey) => {
    const dictionaryRef = parseRefType(xDictionaryKey[SwaggerProps.$ref].split('/'));
    const additionalRef = parseRefType(additionalProperties[SwaggerProps.$ref].split('/'));

    return `${getDescription({
        description,
    })}\t${propertyName}: {\n\t[key in ${dictionaryRef}]: ${additionalRef};\n};\n`;
};
