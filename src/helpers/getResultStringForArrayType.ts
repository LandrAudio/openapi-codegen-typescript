import { ArrayAdditionalProps, ResultStringPropsForArrayType } from '../types';
import { getDescription } from './getDescription';
import { parseFormat } from './parseFormat';
import { parsePropertyName } from './parsePropertyName';
import { parseRefType } from './parseRefType';

export const getResultStringForArrayType = ({
    propertyName,
    description,
    nullable,
    refType,
    format,
    minItems,
    maxItems,
    uniqueItems,
}: ResultStringPropsForArrayType) => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: `${parseRefType(refType)}[]` });
    const formatString = parseFormat(format);
    const minItemsString = minItems ? `${format ? '; ' : ''}${ArrayAdditionalProps.MinItems}: ${minItems}` : '';
    const maxItemsString = maxItems
        ? `${format || minItems ? '; ' : ''}${ArrayAdditionalProps.MaxItems}: ${maxItems}`
        : '';
    const uniqueItemsString = uniqueItems
        ? `${format || minItems || maxItems ? '; ' : ''}${ArrayAdditionalProps.UniqueItems}: ${uniqueItems}`
        : '';

    const shouldShowDocs = format || minItems || maxItems || uniqueItems;
    const documentation = `${formatString}${minItemsString}${maxItemsString}${uniqueItemsString}`;

    return `${getDescription({ description })}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};
