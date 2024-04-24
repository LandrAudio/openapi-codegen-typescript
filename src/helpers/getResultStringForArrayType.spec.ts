import { ResultStringPropsForArrayType } from '../types';
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

const scenarios: { input: ResultStringPropsForArrayType; output: string }[] = [
    {
        input: {
            ...defaultProps,
            description: 'description mocked',
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            description: undefined,
        },
        output: `\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            minItems: undefined,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; maxItems: 10; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            maxItems: undefined,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // minItems: 1; maxItems: 10; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            uniqueItems: false,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10\n`,
    },
    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // maxItems: 10; uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
            maxItems: undefined,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // uniqueItems: true\n`,
    },
    {
        input: {
            ...defaultProps,
            format: (undefined as unknown) as string,
            minItems: undefined,
            maxItems: undefined,
            uniqueItems: false,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[];\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForArrayType(input);

    expect(result).toBe(output);
});
