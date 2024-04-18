import { DictionaryValueResultString } from '../types';
import { getDescription } from './getDescription';

export const getDictionaryValueResultString = ({
    description,
    propertyName,
    dictionaryRef,
    value,
}: DictionaryValueResultString) => {
    return `${getDescription({ description })}\t${propertyName}: {\n[key in ${dictionaryRef}]: ${value};\n};\n`;
};
