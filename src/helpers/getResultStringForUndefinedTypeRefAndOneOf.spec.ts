import { SchemaProperties } from '../types';
import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';

const scenarios: { input: Pick<SchemaProperties, 'propertyName' | 'nullable'>; output: string }[] = [
    { input: { propertyName: 'propertyName mocked', nullable: true }, output: `\tpropertyName mocked?: any;\n` },

    { input: { propertyName: 'propertyName mocked', nullable: false }, output: `\tpropertyName mocked: any;\n` },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForUndefinedTypeRefAndOneOf(input);

    expect(result).toBe(output);
});
