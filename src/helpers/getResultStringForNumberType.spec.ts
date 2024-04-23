import { ResultStringPropsForNumberType } from '../types';
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

const scenarios: [string, { input: ResultStringPropsForNumberType; output: string }][] = [
    [
        'Description provided',
        {
            input: {
                ...defaultProps,
                description: 'description mocked',
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"\n`,
        },
    ],
    [
        'Description undefined',
        {
            input: {
                ...defaultProps,
                description: undefined,
            },
            output: `\tpropertyName mocked?: number; // format: "format mocked"\n`,
        },
    ],
    [
        'Nullable false',
        {
            input: {
                ...defaultProps,
                nullable: false,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: number; // format: "format mocked"\n`,
        },
    ],
    [
        'Minimum defined',
        {
            input: {
                ...defaultProps,
                minimum: 1,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; minimum: 1\n`,
        },
    ],
    [
        'Minimum defined, format undefined',
        {
            input: {
                ...defaultProps,
                minimum: 1,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // minimum: 1\n`,
        },
    ],
    [
        'Maximum defined',
        {
            input: {
                ...defaultProps,
                maximum: 10,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; maximum: 10\n`,
        },
    ],
    [
        'Maximum defined, format and minimum undefined',
        {
            input: {
                ...defaultProps,
                maximum: 10,
                minimum: undefined,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // maximum: 10\n`,
        },
    ],
    [
        'ExclusiveMinimum defined',
        {
            input: {
                ...defaultProps,
                exclusiveMinimum: true,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMinimum: true\n`,
        },
    ],
    [
        'ExclusiveMinimum defined, format, minimum and maximum undefined',
        {
            input: {
                ...defaultProps,
                exclusiveMinimum: true,
                minimum: undefined,
                maximum: undefined,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // exclusiveMinimum: true\n`,
        },
    ],
    [
        'ExclusiveMaximum defined',
        {
            input: {
                ...defaultProps,
                exclusiveMaximum: true,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMaximum: true\n`,
        },
    ],
    [
        'ExclusiveMaximum defined, exclusiveMinimum, minimum, maximum and format undefined',
        {
            input: {
                ...defaultProps,
                exclusiveMaximum: true,
                exclusiveMinimum: undefined,
                minimum: undefined,
                maximum: undefined,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // exclusiveMaximum: true\n`,
        },
    ],
    [
        'No doc',
        {
            input: {
                ...defaultProps,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number;\n`,
        },
    ],
];

describe(`getResultStringForNumberType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForNumberType(input);

        expect(result).toBe(output);
    });
});
