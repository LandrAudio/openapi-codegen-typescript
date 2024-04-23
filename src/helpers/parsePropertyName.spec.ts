import { SchemaProperties } from '../types';
import { parsePropertyName } from './parsePropertyName';

const defaultProps = {
    propertyName: 'propertyName mocked',
    nullable: true,
    type: 'type mocked',
};

const scenarios: [string, { input: Pick<SchemaProperties, 'propertyName' | 'type' | 'nullable'>; output: string }][] = [
    ['With all props defined', { input: { ...defaultProps }, output: `\tpropertyName mocked?: type mocked;` }],
    ['Nullalble false', { input: { ...defaultProps, nullable: false }, output: `\tpropertyName mocked: type mocked;` }],
];

describe(`parseRefType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = parsePropertyName(input);

        expect(result).toBe(output);
    });
});
