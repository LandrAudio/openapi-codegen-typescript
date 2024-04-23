import { SchemaProperties } from '../types';
import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';

const scenarios: [string, { input: Pick<SchemaProperties, 'propertyName' | 'nullable'>; output: string }][] = [
    [
        'Nullable true',
        { input: { propertyName: 'propertyName mocked', nullable: true }, output: `\tpropertyName mocked?: any;\n` },
    ],
    [
        'Nullable false',
        { input: { propertyName: 'propertyName mocked', nullable: false }, output: `\tpropertyName mocked: any;\n` },
    ],
];

describe(`getResultStringForUndefinedTypeRefAndOneOf`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForUndefinedTypeRefAndOneOf(input);

        expect(result).toBe(output);
    });
});
