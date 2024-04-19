import { getStandardString } from './getStandardString';

const scenarios = [
    {
        scenarioName: 'All props defined',
        props: {
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            refType: ['first', 'second'],
            format: 'format mocked',
            isArray: true,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: second[];format: "format mocked"\n`,
    },
    {
        scenarioName: 'Description undefined',
        props: {
            propertyName: 'propertyName mocked',
            description: undefined,
            nullable: true,
            refType: ['first', 'second'],
            format: 'format mocked',
            isArray: true,
        },
        expected: `\tpropertyName mocked?: second[];format: "format mocked"\n`,
    },
    {
        scenarioName: 'Nullable false',
        props: {
            propertyName: 'propertyName mocked',
            description: undefined,
            nullable: false,
            refType: ['first', 'second'],
            format: 'format mocked',
            isArray: true,
        },
        expected: `\tpropertyName mocked: second[];format: "format mocked"\n`,
    },
    {
        scenarioName: 'IsArray false',
        props: {
            propertyName: 'propertyName mocked',
            description: undefined,
            nullable: true,
            refType: ['first', 'second'],
            format: 'format mocked',
            isArray: false,
        },
        expected: `\tpropertyName mocked?: second;format: "format mocked"\n`,
    },
    {
        scenarioName: 'Format undefined',
        props: {
            propertyName: 'propertyName mocked',
            description: undefined,
            nullable: true,
            refType: ['first', 'second'],
            format: undefined,
            isArray: false,
        },
        expected: `\tpropertyName mocked?: second;\n`,
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getStandardString(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
