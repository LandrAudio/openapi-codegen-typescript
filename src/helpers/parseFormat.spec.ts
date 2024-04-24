import { parseFormat } from './parseFormat';

const scenarios: { input?: string; output: string }[] = [
    { input: 'format mocked', output: `format: "format mocked"` },
    { input: undefined, output: `` },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = parseFormat(input);

    expect(result).toBe(output);
});
