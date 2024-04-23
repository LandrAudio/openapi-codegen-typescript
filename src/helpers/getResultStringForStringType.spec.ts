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

const scenarios: [string, { input: ResultStringPropsForStringType; output: string }][] = [
    [
        'Description provided',
        {
            input: {
                ...defaultProps,
                description: 'description mocked',
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"\n`,
        },
    ],
    [
        'Description undefined',
        {
            input: {
                ...defaultProps,
                description: undefined,
            },
            output: `\tpropertyName mocked?: string; // format: "format mocked"\n`,
        },
    ],
    [
        'Nullable false',
        {
            input: {
                ...defaultProps,
                nullable: false,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: string; // format: "format mocked"\n`,
        },
    ],
    [
        'MinLength defined',
        {
            input: {
                ...defaultProps,
                minLength: 1,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; minLength: 1\n`,
        },
    ],
    [
        'MinLength defined, format undefined',
        {
            input: {
                ...defaultProps,
                minLength: 1,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // minLength: 1\n`,
        },
    ],
    [
        'MaxLength defined',
        {
            input: {
                ...defaultProps,
                maxLength: 10,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // format: "format mocked"; maxLength: 10\n`,
        },
    ],
    [
        'MaxLength defined, format and minLength undefined',
        {
            input: {
                ...defaultProps,
                maxLength: 10,
                minLength: undefined,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string; // maxLength: 10\n`,
        },
    ],
    [
        'No doc',
        {
            input: {
                ...defaultProps,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: string;\n`,
        },
    ],
];

describe(`getResultStringForStringType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForStringType(input);

        expect(result).toBe(output);
    });
});
