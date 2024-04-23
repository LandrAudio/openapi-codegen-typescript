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

const scenarios: { input: ResultStringPropsForNumberType; output: string }[] = [
    {
        input: {
            ...defaultProps,
            description: 'description mocked',
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"\n`,
    },
    {
        input: {
            ...defaultProps,
            description: undefined,
        },
        output: `\tpropertyName mocked?: number; // format: "format mocked"\n`,
    },
    {
        input: {
            ...defaultProps,
            nullable: false,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: number; // format: "format mocked"\n`,
    },
    {
        input: {
            ...defaultProps,
            minimum: 1,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; minimum: 1\n`,
    },
    {
        input: {
            ...defaultProps,
            minimum: 1,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // minimum: 1\n`,
    },
    {
        input: {
            ...defaultProps,
            maximum: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; maximum: 10\n`,
    },
    {
        input: {
            ...defaultProps,
            maximum: 10,
            minimum: undefined,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // maximum: 10\n`,
    },
    {
        input: {
            ...defaultProps,
            exclusiveMinimum: true,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMinimum: true\n`,
    },
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
    {
        input: {
            ...defaultProps,
            exclusiveMaximum: true,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number; // format: "format mocked"; exclusiveMaximum: true\n`,
    },
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
    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number;\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForNumberType(input);

    expect(result).toBe(output);
});
