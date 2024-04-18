import { parsePropertyName } from './parsePropertyName';

const defaultProps = {
    propertyName: 'propertyName mocked',
    nullable: true,
    type: 'type mocked',
};

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: { ...defaultProps },
        expected: `\tpropertyName mocked?: type mocked;`,
    },
    {
        scenarioName: 'Nullalble false',
        props: { ...defaultProps, nullable: false },
        expected: `\tpropertyName mocked: type mocked;`,
    },
];

describe(`parseRefType`, () => {
    scenarios.forEach(config => {
        it(`should return expected string for ${config.scenarioName}`, async () => {
            const result = parsePropertyName(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
