import { getDescription } from '../src/helpers/getDescription';

const scenarios = [
    {
        description: 'mock description',
        expected: `/**\n * mock description\n */\n`,
    },
    {
        description: undefined,
        expected: '',
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return ${config.expected} when description is ${config.description}`, async () => {
            const result = getDescription({ description: config.description });

            expect(result).toBe(config.expected);
        });
    });
});
