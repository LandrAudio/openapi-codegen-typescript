import { ResultStringForArrayWithoutItemRef, SwaggerProps } from '../types';
import { parseFormat } from './parseFormat';
import { parseProperty } from './parseProperty';
import { parseRefType } from './parseRefType';

export const getResultStringForArrayWithoutItemRef = ({
    items,
    propertyName,
    description,
    nullable,
    format,
    maxItems,
}: ResultStringForArrayWithoutItemRef) => {
    const shouldShowBrackets = items.oneOf && items.oneOf.type ? '' : '[]';

    let type = '';

    if (items.oneOf) {
        type = parseRefType(items.oneOf[0][SwaggerProps.$ref].split('/'));
    } else {
        const swaggerType = items[SwaggerProps.Type];
        if (swaggerType === 'integer') {
            type = 'number';
        } else {
            type = swaggerType || 'any';
        }
    }

    return `${parseProperty({
        propertyName,
        description,
        nullable,
    })}${type}${shouldShowBrackets};${parseFormat(format)}${maxItems ? ` // maxItems: ${maxItems}` : ''}\n`;
};
