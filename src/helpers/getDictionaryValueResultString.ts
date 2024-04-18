import { DictionaryValueResultString } from '../types';
import { getDescription } from './getDescription';

export const getDictionaryValueResultString = ({
    description,
    propertyName,
    xDictionaryKey,
    value,
}: DictionaryValueResultString) => {
    return `${getDescription({ description })}\t${propertyName}: {\n[key in ${xDictionaryKey}]: ${value}; \n }; \n`;
};
