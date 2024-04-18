import { getDescription } from '../src/helpers/getDescription';

const scenarios = [
    {
        props: 'mock description',
        expected: `/**\n * mock description\n */\n`,
    },
    {
        props: undefined,
        expected: '',
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return ${config.expected} when props is ${config.props}`, async () => {
            const result = getDescription(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
