import { ResultStringProps } from '../types';
import { getDescription } from './getDescription';

export const getResultStringForBooleanType = ({ propertyName, description, nullable }: ResultStringProps) => {
    const nameAndValue = `\t${propertyName}${nullable ? '?' : ''}: boolean;`;

    return `${getDescription({ description })}${nameAndValue}\n`;
};
