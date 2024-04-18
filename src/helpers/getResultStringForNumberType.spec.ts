import { getResultStringForNumberType } from './getResultStringForNumberType';

const defaultProps = {
    propertyName: 'propertyName mocked',
    description: 'description mocked',
    nullable: true,
    format: 'format mocked',
    minimum: undefined,
    maximum: undefined,
    exclusiveMinimum: undefined,
    exclusiveMaximum: undefined,
};

const scenarios = [
    {
        scenarioName: 'Description provided',
        props: {
            ...defaultProps,
            description: 'description mocked',
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'Description undefined',
        props: {
            ...defaultProps,
            description: undefined,
        },
        expected: `\tpropertyName mocked?: number; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'Nullable false',
        props: {
            ...defaultProps,
            nullable: false,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked: number; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'Minimum defined',
        props: {
            ...defaultProps,
            minimum: 1,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; minimum: 1\n`,
    },
    {
        scenarioName: 'Minimum defined, format undefined',
        props: {
            ...defaultProps,
            minimum: 1,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // minimum: 1\n`,
    },
    {
        scenarioName: 'Maximum defined',
        props: {
            ...defaultProps,
            maximum: 10,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; maximum: 10\n`,
    },
    {
        scenarioName: 'Maximum defined, format and minimum undefined',
        props: {
            ...defaultProps,
            maximum: 10,
            minimum: undefined,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // maximum: 10\n`,
    },
    {
        scenarioName: 'ExclusiveMinimum defined',
        props: {
            ...defaultProps,
            exclusiveMinimum: true,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMinimum: true\n`,
    },
    {
        scenarioName: 'ExclusiveMinimum defined, format, minimum and maximum undefined',
        props: {
            ...defaultProps,
            exclusiveMinimum: true,
            minimum: undefined,
            maximum: undefined,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // exclusiveMinimum: true\n`,
    },
    {
        scenarioName: 'ExclusiveMaximum defined',
        props: {
            ...defaultProps,
            exclusiveMaximum: true,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMaximum: true\n`,
    },
    {
        scenarioName: 'ExclusiveMaximum defined, exclusiveMinimum, minimum, maximum and format undefined',
        props: {
            ...defaultProps,
            exclusiveMaximum: true,
            exclusiveMinimum: undefined,
            minimum: undefined,
            maximum: undefined,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // exclusiveMaximum: true\n`,
    },
    {
        scenarioName: 'No doc',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number;\n`,
    },
];

describe(`getResultStringForNumberType`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForNumberType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
