import { DictionaryValueResultString } from '../types';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';

const scenarios: [string, { input: DictionaryValueResultString; output: string }][] = [
    [
        'return when all props are defined',
        {
            input: {
                description: 'description mocked',
                propertyName: 'propertyName mocked',
                dictionaryRef: 'dictionaryRef mocked',
                value: 'value mocked',
            },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key in dictionaryRef mocked]: value mocked;\n};\n`,
        },
    ],

    [
        'return when description is undefined',
        {
            input: {
                description: undefined,
                propertyName: 'propertyName mocked',
                dictionaryRef: 'dictionaryRef mocked',
                value: 'value mocked',
            },
            output: `\tpropertyName mocked: {\n\t[key in dictionaryRef mocked]: value mocked;\n};\n`,
        },
    ],
];

describe(`getDictionaryValueResultString`, () => {
    it.each(scenarios)(`should %s`, (_, { input, output }) => {
        const result = getDictionaryValueResultString(input);

        expect(result).toBe(output);
    });
});
