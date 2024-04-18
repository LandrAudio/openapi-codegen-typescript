import { parseFormat } from './parseFormat';

const scenarios = [
    {
        scenarioName: 'format defined',
        props: 'format mocked',
        expected: `format: "format mocked"`,
    },
    {
        scenarioName: 'format undefined',
        props: undefined,
        expected: ``,
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return expected string for ${config.scenarioName}`, async () => {
            const result = parseFormat(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
