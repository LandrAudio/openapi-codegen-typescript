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

const scenarios: [string, { input: ResultStringPropsForArrayType; output: string }][] = [
    [
        'Description provided',
        {
            input: {
                ...defaultProps,
                description: 'description mocked',
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
        },
    ],
    [
        'Description undefined',
        {
            input: {
                ...defaultProps,
                description: undefined,
            },
            output: `\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10; uniqueItems: true\n`,
        },
    ],
    [
        'MinItems undefined',
        {
            input: {
                ...defaultProps,
                minItems: undefined,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; maxItems: 10; uniqueItems: true\n`,
        },
    ],
    [
        'MaxItems undefined',
        {
            input: {
                ...defaultProps,
                maxItems: undefined,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; uniqueItems: true\n`,
        },
    ],
    [
        'Format undefined',
        {
            input: {
                ...defaultProps,
                format: (undefined as unknown) as string,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // minItems: 1; maxItems: 10; uniqueItems: true\n`,
        },
    ],
    [
        'UniqueItems is false',
        {
            input: {
                ...defaultProps,
                uniqueItems: false,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // format: "format mocked"; minItems: 1; maxItems: 10\n`,
        },
    ],
    [
        'Format and min items undefined',
        {
            input: {
                ...defaultProps,
                format: (undefined as unknown) as string,
                minItems: undefined,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // maxItems: 10; uniqueItems: true\n`,
        },
    ],

    [
        'Format, min and max items undefined',
        {
            input: {
                ...defaultProps,
                format: (undefined as unknown) as string,
                minItems: undefined,
                maxItems: undefined,
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: refType mocked[]; // uniqueItems: true\n`,
        },
    ],

    [
        'No doc',
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
    ],
];

describe(`getResultStringForArrayType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForArrayType(input);

        expect(result).toBe(output);
    });
});
