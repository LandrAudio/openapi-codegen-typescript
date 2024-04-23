import { getDescription } from '../src/helpers/getDescription';

const scenarios: [string, { input?: string; output: string }][] = [
    ['return a description when provided', { input: 'mock description', output: `/**\n * mock description \n */\n` }],
    ['return empty string when description is undefined', { input: undefined, output: '' }],
];

describe(`getDescription`, () => {
    it.each(scenarios)(`should %s`, (_, { input, output }) => {
        const result = getDescription(input);

        expect(result).toBe(output);
    });
});
