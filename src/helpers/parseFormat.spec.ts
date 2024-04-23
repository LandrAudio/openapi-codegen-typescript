import { parseFormat } from './parseFormat';

const scenarios: [string, { input?: string; output: string }][] = [
    ['format defined', { input: 'format mocked', output: `format: "format mocked"` }],
    ['format undefined', { input: undefined, output: `` }],
];

describe(`getDescription`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = parseFormat(input);

        expect(result).toBe(output);
    });
});
