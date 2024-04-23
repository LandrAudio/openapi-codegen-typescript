import { parseRefType } from './parseRefType';

const scenarios: { input: string[]; output: string }[] = [
    { input: [], output: (undefined as unknown) as string },
    { input: ['first'], output: `first` },
    { input: ['first', 'second'], output: `second` },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = parseRefType(input);

    expect(result).toBe(output);
});
