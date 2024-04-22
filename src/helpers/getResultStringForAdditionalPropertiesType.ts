import { DataTypes, ResultStringForAdditionalPropertiesType, SwaggerProps } from '../types';
import { getDescription } from './getDescription';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';
import { parseRefType } from './parseRefType';

export type ResultStringForAdditionalPropertiesType = {
    additionalProperties: any;
    description?: string;
    propertyName: string;
};

export const getResultStringForAdditionalPropertiesType = ({
    additionalProperties,
    xDictionaryKey,
    description,
    propertyName,
}: ResultStringForAdditionalPropertiesType) => {
    let res;

    switch (additionalProperties.type) {
        case DataTypes.Boolean:
            res = DataTypes.Boolean;
            break;
        case DataTypes.Integer:
            res = DataTypes.Number;
            break;
        case DataTypes.Number:
            res = DataTypes.Number;
            break;
        case DataTypes.String:
            res = DataTypes.String;
            break;
        case DataTypes.Array:
            if (additionalProperties.items && additionalProperties.items[SwaggerProps.$ref]) {
                res = `${parseRefType(additionalProperties.items[SwaggerProps.$ref].split('/'))}[]`;
            } else {
                res = `"// TODO: Something is wrong"`;
            }
            break;
        default:
            res = `"// TODO: Something is wrong, type ${additionalProperties.type} is not supported"`;
            break;
    }

    if (xDictionaryKey && !!xDictionaryKey[SwaggerProps.$ref]) {
        const dictionaryRef = parseRefType(xDictionaryKey[SwaggerProps.$ref].split('/'));

        return getDictionaryValueResultString({
            description,
            dictionaryRef,
            propertyName,
            value: res,
        });
    } else {
        return `${getDescription({ description })}\t${propertyName}: {\n [key: string]: ${res};\n };\n`;
    }
};
