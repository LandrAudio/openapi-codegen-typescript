import { getResultStringForUndefinedTypeRefAndOneOf } from './getResultStringForUndefinedTypeRefAndOneOf';

const scenarios = [
    {
        scenarioName: 'Nullable true',
        props: { propertyName: 'propertyName mocked', nullable: true },
        expected: `\tpropertyName mocked?: any;\n`,
    },
    {
        scenarioName: 'Nullable false',
        props: { propertyName: 'propertyName mocked', nullable: false },
        expected: `\tpropertyName mocked: any;\n`,
    },
];

describe(`getResultStringForUndefinedTypeRefAndOneOf`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForUndefinedTypeRefAndOneOf(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
