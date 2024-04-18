import { getDescription } from './getDescription';

const scenarios = [
    {
        scenarioName: 'Description provided',
        props: { description: 'description mocked' },
        expected: `/**\n * description mocked\n */\n`,
    },
    {
        scenarioName: 'Description undefined',
        props: { description: undefined },
        expected: '',
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getDescription(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
