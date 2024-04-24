import { DictionaryValueResultString } from '../types';
import { getDictionaryValueResultString } from './getDictionaryValueResultString';

const scenarios: { input: DictionaryValueResultString; output: string }[] = [
    {
        input: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'dictionaryRef mocked',
            value: 'value mocked',
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key in dictionaryRef mocked]: value mocked;\n};\n`,
    },

    {
        input: {
            description: undefined,
            propertyName: 'propertyName mocked',
            dictionaryRef: 'dictionaryRef mocked',
            value: 'value mocked',
        },
        output: `\tpropertyName mocked: {\n\t[key in dictionaryRef mocked]: value mocked;\n};\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getDictionaryValueResultString(input);

    expect(result).toBe(output);
});
