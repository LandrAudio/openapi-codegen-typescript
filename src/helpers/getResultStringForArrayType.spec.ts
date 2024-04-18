import { getResultStringForArrayType } from './getResultStringForArrayType';

const defaultProps = {
    propertyName: 'propertyName mocked',
    description: 'description mocked',
    nullable: true,
    refType: ['path', 'refType mocked'],
    format: 'format mocked',
    minItems: 1,
    maxItems: 10,
    uniqueItems: true,
};

const scenarios = [
    {
        scenarioName: 'Description provided',
        props: {
            ...defaultProps,
            description: 'description mocked',
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        scenarioName: 'Description undefined',
        props: {
            ...defaultProps,
            description: undefined,
        },
        expected: `\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        scenarioName: 'MinItems undefined',
        props: {
            ...defaultProps,
            minItems: undefined,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; maxItems: 10; uniqueItems: true\n`,
    },
    {
        scenarioName: 'MaxItems undefined',
        props: {
            ...defaultProps,
            maxItems: undefined,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; uniqueItems: true\n`,
    },
    {
        scenarioName: 'Format undefined',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        scenarioName: 'UniqueItems is false',
        props: {
            ...defaultProps,
            uniqueItems: false,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10\n`,
    },
    {
        scenarioName: 'Format and min items undefined',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // maxItems: 10; uniqueItems: true\n`,
    },
    {
        scenarioName: 'Format, min and max items undefined',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
            maxItems: undefined,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // uniqueItems: true\n`,
    },
    {
        scenarioName: 'No doc',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
            maxItems: undefined,
            uniqueItems: false,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[];\n`,
    },
];

describe(`getResultStringForArrayType`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForArrayType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
