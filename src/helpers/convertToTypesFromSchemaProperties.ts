import { getSchemaProperties } from '../shared';
import { SwaggerProps, SwaggerSchema } from '../types';
import { getDescription } from './getDescription';
import { getResultStringForAdditionalPropertiesType } from './getResultStringForAdditionalPropertiesType';
import { getResultStringForArrayType } from './getResultStringForArrayType';
import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';
import { getResultStringForBooleanType } from './getResultStringForBooleanType';
import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';
import { getResultStringForNumberType } from './getResultStringForNumberType';
import { getResultStringForStringType } from './getResultStringForStringType';
import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';
import { getResultStringType } from './getResultStringType';
import { parseFormat } from './parseFormat';
import { parseProperty } from './parseProperty';
import { parseRefType } from './parseRefType';

export const convertToTypesFromSchemaProperties = ({
    schema,
    schemaKey,
    interfaces,
}: {
    schema: SwaggerSchema;
    schemaKey?: string;
    interfaces?: Array<string>;
}): string => {
    const getStandardString = ({ propertyName, description, nullable, refType, format, isArray }: any) => {
        return `${parseProperty({ propertyName, description, nullable })}${parseRefType(refType)}${
            isArray ? '[]' : ''
        };${parseFormat(format)}\n`;
    };

    let result = `${getDescription({ description: schema.description })}export interface ${schemaKey}${
        interfaces ? ` extends ${interfaces.join(', ')} ` : ' '
    }{\n`;

    if (schema.properties) {
        getSchemaProperties(schema.properties).map(props => {
            const resultStringType = getResultStringType(props);

            switch (resultStringType) {
                case 'String':
                    result += getResultStringForStringType(props);
                    break;
                case 'Number':
                    result += getResultStringForNumberType(props);
                    break;
                case 'Boolean':
                    result += getResultStringForBooleanType(props);
                    break;
                case 'ItemWithRef':
                    result += getResultStringForArrayType({
                        ...props,
                        refType: props.items[SwaggerProps.$ref].split('/'),
                    });
                    break;
                case 'ItemWithoutRef':
                    result += getResultStringForArrayWithoutItemRef(props);
                    break;
                case 'OneOf':
                    result += getStandardString({
                        ...props,
                        refType: props.oneOf[0][SwaggerProps.$ref].split('/'),

                        isArray: false,
                    });
                    break;
                case 'Ref':
                    result += getStandardString({ ...props, refType: props.$ref.split('/'), isArray: false });
                    break;
                case 'UndefinedTypeRefAndOneOf':
                    result += getResultStringForUndefinedTypeRefAndOneOf(props);
                    break;
                case 'DictionaryKey':
                    result += getResultStringForDictionaryKey(props);
                    break;
                case 'AdditionalPropertiesType':
                    result += getResultStringForAdditionalPropertiesType(props);
                    break;
                case 'Invalid':
                default:
                    result += ' "// TODO: Something is wrong" ';
                    break;
            }
        });
    }

    result += '}\n';

    return result;
};
