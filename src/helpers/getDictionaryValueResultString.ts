import { DictionaryValueResultString } from '../types';
import { getDescription } from './getDescription';

export const getDictionaryValueResultString = ({
    description,
    propertyName,
    dictionaryRef,
    value,
}: DictionaryValueResultString) => {
    return `${getDescription({ description })}\t${propertyName}: {\n\t[key in ${dictionaryRef}]: ${value};\n};\n`;
};
