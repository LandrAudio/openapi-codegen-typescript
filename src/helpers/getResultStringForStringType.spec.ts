import { getResultStringForStringType } from './getResultStringForStringType';

const defaultProps = {
    propertyName: 'propertyName mocked',
    description: 'description mocked',
    nullable: true,
    format: 'format mocked',
    minLength: undefined,
    maxLength: undefined,
};

const scenarios = [
    {
        scenarioName: 'Description provided',
        props: {
            ...defaultProps,
            description: 'description mocked',
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'Description undefined',
        props: {
            ...defaultProps,
            description: undefined,
        },
        expected: `\tpropertyName mocked?: string; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'Nullable false',
        props: {
            ...defaultProps,
            nullable: false,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked: string; // format: "format mocked"\n`,
    },
    {
        scenarioName: 'MinLength defined',
        props: {
            ...defaultProps,
            minLength: 1,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; minLength: 1\n`,
    },
    {
        scenarioName: 'MinLength defined, format undefined',
        props: {
            ...defaultProps,
            minLength: 1,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // minLength: 1\n`,
    },
    {
        scenarioName: 'MaxLength defined',
        props: {
            ...defaultProps,
            maxLength: 10,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; maxLength: 10\n`,
    },
    {
        scenarioName: 'MaxLength defined, format and minLength undefined',
        props: {
            ...defaultProps,
            maxLength: 10,
            minLength: undefined,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // maxLength: 10\n`,
    },
    {
        scenarioName: 'No doc',
        props: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: string;\n`,
    },
];

describe(`getResultStringForStringType`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForStringType(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
