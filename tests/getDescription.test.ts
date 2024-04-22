import { getDescription } from '../src/helpers/getDescription';

const scenarios = [
    ['return a description when provided', 'mock description', `/**\n * mock description\n */\n`],
    ['return empty string when description is undefined', undefined, ''],
];

describe(`getDescription`, () => {
    it.each(scenarios)(`should %s`, (_, props, expected) => {
        const result = getDescription(props);

        expect(result).toBe(expected);
    });
});
