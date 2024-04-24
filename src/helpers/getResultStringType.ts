import { DataTypes, SchemaProperties, SwaggerProps } from '../types';

export const getResultStringType = ({
    type,
    items,
    oneOf,
    xDictionaryKey,
    additionalProperties,
    $ref,
}: Pick<
    SchemaProperties,
    'type' | 'additionalProperties' | 'items' | 'oneOf' | 'xDictionaryKey' | 'additionalProperties' | '$ref'
>) => {
    const isStringType = type === DataTypes.String;
    const isNumberType = type === DataTypes.Integer || type === DataTypes.Number;
    const isBooleanType = type === DataTypes.Boolean;
    const hasItems = type === DataTypes.Array && !!items;
    const isItemWithRef = hasItems && !!items[SwaggerProps.$ref];
    const isItemWithoutRef = hasItems && !items[SwaggerProps.$ref];
    const isOneOf = !!oneOf && Array.isArray(oneOf) && !!oneOf[0][SwaggerProps.$ref];
    const isRef = !!$ref;
    const hasUndefinedTypeRefAndOneOf = !type && !$ref && !oneOf;
    const hasDictionaryKeyRef = !!xDictionaryKey && !!xDictionaryKey[SwaggerProps.$ref];
    const hasAddtionalPropertiesRef = !!additionalProperties && !!additionalProperties[SwaggerProps.$ref];
    const isDictionaryKey = hasDictionaryKeyRef && hasAddtionalPropertiesRef;
    const isAdditionalPropertiesType = !!additionalProperties && !!additionalProperties.type;

    if (isStringType) {
        return 'String';
    } else if (isNumberType) {
        return 'Number';
    } else if (isBooleanType) {
        return 'Boolean';
    } else if (isItemWithRef) {
        return 'ItemWithRef';
    } else if (isItemWithoutRef) {
        return 'ItemWithoutRef';
    } else if (isOneOf) {
        return 'OneOf';
    } else if (isRef) {
        return 'Ref';
    } else if (hasUndefinedTypeRefAndOneOf) {
        return 'UndefinedTypeRefAndOneOf';
    } else if (isDictionaryKey) {
        return 'DictionaryKey';
    } else if (isAdditionalPropertiesType) {
        return 'AdditionalPropertiesType';
    } else {
        return 'Invalid';
    }
};
