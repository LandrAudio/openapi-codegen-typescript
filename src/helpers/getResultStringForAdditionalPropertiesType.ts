import { DataTypes, SwaggerProps } from '../types';
import { getDescription } from './getDescription';
import { parseRefType } from './parseRefType';

export const getResultStringForAdditionalPropertiesType = ({
    additionalProperties,
    description,
    propertyName,
}: {
    additionalProperties: any;
    description?: string;
    propertyName: string;
}) => {
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

    return `${getDescription(description)}\t${propertyName}: {\n [key: string]: ${res};\n };\n`;
};
