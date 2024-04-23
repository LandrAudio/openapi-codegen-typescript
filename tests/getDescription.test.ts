import { getDescription } from '../src/helpers/getDescription';
import { SchemaProperties } from '../src/types';

const scenarios: [string, { input: Pick<SchemaProperties, 'description'>; output: string }][] = [
    [
        'return a description when provided',
        { input: { description: 'mock description' }, output: `/**\n * mock description \n */\n` },
    ],
    ['return empty string when description is undefined', { input: { description: undefined }, output: '' }],
];

describe(`getDescription`, () => {
    it.each(scenarios)(`should %s`, (_, { input, output }) => {
        const result = getDescription(input);

        expect(result).toBe(output);
    });
});
