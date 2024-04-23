import { ResultStringPropsForStringType } from '../types';
import { getResultStringForStringType } from './getResultStringForStringType';

const defaultProps = {
    propertyName: 'propertyName mocked',
    description: 'description mocked',
    nullable: true,
    format: 'format mocked',
    minLength: undefined,
    maxLength: undefined,
};

const scenarios: { input: ResultStringPropsForStringType; output: string }[] = [
    {
        input: {
            ...defaultProps,
            description: 'description mocked',
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"\n`,
    },

    {
        input: {
            ...defaultProps,
            description: undefined,
        },
        output: `\tpropertyName mocked?: string; // format: "format mocked"\n`,
    },

    {
        input: {
            ...defaultProps,
            nullable: false,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: string; // format: "format mocked"\n`,
    },

    {
        input: {
            ...defaultProps,
            minLength: 1,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; minLength: 1\n`,
    },

    {
        input: {
            ...defaultProps,
            minLength: 1,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // minLength: 1\n`,
    },

    {
        input: {
            ...defaultProps,
            maxLength: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; maxLength: 10\n`,
    },

    {
        input: {
            ...defaultProps,
            maxLength: 10,
            minLength: undefined,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // maxLength: 10\n`,
    },

    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string;\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForStringType(input);

    expect(result).toBe(output);
});
