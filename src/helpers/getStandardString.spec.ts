import { getStandardString } from './getStandardString';

const scenarios: [string, { input: any; output: string }][] = [
    [
        'All props defined',
        {
            input: {
                propertyName: 'propertyName mocked',
                description: 'description mocked',
                nullable: true,
                refType: ['first', 'second'],
                format: 'format mocked',
                isArray: true,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: second[];format: "format mocked"\n`,
        },
    ],
    [
        'Description undefined',
        {
            input: {
                propertyName: 'propertyName mocked',
                description: undefined,
                nullable: true,
                refType: ['first', 'second'],
                format: 'format mocked',
                isArray: true,
            },
            output: `\tpropertyName mocked?: second[];format: "format mocked"\n`,
        },
    ],
    [
        'Nullable false',
        {
            input: {
                propertyName: 'propertyName mocked',
                description: undefined,
                nullable: false,
                refType: ['first', 'second'],
                format: 'format mocked',
                isArray: true,
            },
            output: `\tpropertyName mocked: second[];format: "format mocked"\n`,
        },
    ],
    [
        'IsArray false',
        {
            input: {
                propertyName: 'propertyName mocked',
                description: undefined,
                nullable: true,
                refType: ['first', 'second'],
                format: 'format mocked',
                isArray: false,
            },
            output: `\tpropertyName mocked?: second;format: "format mocked"\n`,
        },
    ],
    [
        'Format undefined',
        {
            input: {
                propertyName: 'propertyName mocked',
                description: undefined,
                nullable: true,
                refType: ['first', 'second'],
                format: undefined,
                isArray: false,
            },
            output: `\tpropertyName mocked?: second;\n`,
        },
    ],
];

describe(`getDescription`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getStandardString(input);

        expect(result).toBe(output);
    });
});
