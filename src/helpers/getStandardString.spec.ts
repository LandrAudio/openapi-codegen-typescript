import { getStandardString } from './getStandardString';

const scenarios: { input: any; output: string }[] = [
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
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getStandardString(input);

    expect(result).toBe(output);
});
