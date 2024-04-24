import { ResultStringPropsForStringType, StringAdditionalProps } from '../types';
import { getDescription } from './getDescription';
import { parseFormat } from './parseFormat';
import { parsePropertyName } from './parsePropertyName';

export const getResultStringForStringType = ({
    propertyName,
    description,
    nullable,
    format,
    minLength,
    maxLength,
}: ResultStringPropsForStringType): string => {
    const nameAndValue = parsePropertyName({ propertyName, nullable, type: 'string' });
    const formatString = parseFormat(format);
    const minString = minLength ? `${format ? '; ' : ''}${StringAdditionalProps.MinLength}: ${minLength}` : '';
    const maxString = maxLength
        ? `${format || minLength ? '; ' : ''}${StringAdditionalProps.MaxLength}: ${maxLength}`
        : '';

    const shouldShowDocs = format || minLength || maxLength;

    const documentation = `${formatString}${minString}${maxString}`;

    return `${getDescription({ description })}${nameAndValue}${shouldShowDocs ? ` // ${documentation}` : ''}\n`;
};
