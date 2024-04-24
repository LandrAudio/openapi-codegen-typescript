import { parseFormat } from './parseFormat';
import { parseProperty } from './parseProperty';
import { parseRefType } from './parseRefType';

export const getStandardString = ({ propertyName, description, nullable, refType, format, isArray }: any) => {
    return `${parseProperty({ propertyName, description, nullable })}${parseRefType(refType)}${
        isArray ? '[]' : ''
    };${parseFormat(format)}\n`;
};
