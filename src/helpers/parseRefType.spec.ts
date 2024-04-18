import { parseRefType } from './parseRefType';

const scenarios = [
    {
        scenarioName: 'empty array',
        props: [],
        expected: undefined,
    },
    {
        scenarioName: 'array with one entry',
        props: ['first'],
        expected: `first`,
    },
    {
        scenarioName: 'array with more than one entries',
        props: ['first', 'second'],
        expected: `second`,
    },
];

describe(`parseRefType`, () => {
    scenarios.forEach(config => {
        it(`should return expected string for ${config.scenarioName}`, async () => {
            const result = parseRefType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
