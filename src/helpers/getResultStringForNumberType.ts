import { NumberAdditionalProps, ResultStringPropsForNumberType, SchemaProperties } from '../types';
import { getDescription } from './getDescription';
import { parseFormat } from './parseFormat';
import { parsePropertyName } from './parsePropertyName';

export const getResultStringForNumberType = ({
    propertyName,
    description,
    nullable,
    format,
    minimum,
    maximum,
    exclusiveMinimum,
    exclusiveMaximum,
}: ResultStringPropsForNumberType) => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: 'number' });
    const formatString = parseFormat(format);
    const minimumString = minimum ? `${format ? '; ' : ''}${NumberAdditionalProps.Minimum}: ${minimum}` : '';
    const maximumString = maximum ? `${format || minimum ? '; ' : ''}${NumberAdditionalProps.Maximum}: ${maximum}` : '';
    const exclusiveMinimumString = exclusiveMinimum
        ? `${format || minimum || maximum ? '; ' : ''}${NumberAdditionalProps.ExclusiveMinimum}: ${exclusiveMinimum}`
        : '';
    const exclusiveMaximumString = exclusiveMaximum
        ? `${format || minimum || maximum || exclusiveMinimum ? '; ' : ''}${
              NumberAdditionalProps.ExclusiveMaximum
          }: ${exclusiveMaximum}`
        : '';

    const shouldShowDocs = format || minimum || maximum || exclusiveMinimum || exclusiveMaximum;

    const documentation = `${formatString}${minimumString}${maximumString}${exclusiveMinimumString}${exclusiveMaximumString}`;

    return `${getDescription({ description })}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};
