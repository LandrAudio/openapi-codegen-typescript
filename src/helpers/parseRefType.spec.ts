import { parseRefType } from './parseRefType';

const scenarios: [string, { input: string[]; output: string }][] = [
    ['empty array', { input: [], output: (undefined as unknown) as string }],
    ['array with one entry', { input: ['first'], output: `first` }],
    ['array with more than one entries', { input: ['first', 'second'], output: `second` }],
];

describe(`parseRefType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = parseRefType(input);

        expect(result).toBe(output);
    });
});
