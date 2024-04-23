import { SchemaProperties } from '../types';
import { parsePropertyName } from './parsePropertyName';

const defaultProps = {
    propertyName: 'propertyName mocked',
    nullable: true,
    type: 'type mocked',
};

const scenarios: { input: Pick<SchemaProperties, 'propertyName' | 'type' | 'nullable'>; output: string }[] = [
    { input: { ...defaultProps }, output: `\tpropertyName mocked?: type mocked;` },
    { input: { ...defaultProps, nullable: false }, output: `\tpropertyName mocked: type mocked;` },
];

it.each(scenarios)(`should return expected string `, ({ input, output }) => {
    const result = parsePropertyName(input);

    expect(result).toBe(output);
});
