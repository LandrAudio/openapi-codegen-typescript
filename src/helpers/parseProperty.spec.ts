import { parseProperty } from './parseProperty';

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: true },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: `,
    },
    {
        scenarioName: 'Description undefined',
        props: { propertyName: 'propertyName mocked', description: undefined, nullable: true },
        expected: `\tpropertyName mocked?: `,
    },
    {
        scenarioName: 'Nullable is false',
        props: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: false },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked: `,
    },
];

describe(`parseProperty`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = parseProperty(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
