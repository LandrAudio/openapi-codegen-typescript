import { ResultStringForDictionaryKey } from '../types';
import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';

const defaultProps = {
    xDictionaryKey: { $ref: 'path/dictionaryKeyMocked' },
    additionalProperties: { $ref: 'path/additionalPropertiesMocked' },
    description: 'description mocked',
    propertyName: 'propertyName mocked',
};

const scenarios: [string, { input: ResultStringForDictionaryKey; output: string }][] = [
    [
        'With all props defined',
        {
            input: defaultProps,
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key in dictionaryKeyMocked]: additionalPropertiesMocked;\n};\n`,
        },
    ],

    [
        'Description undefined',
        {
            input: { ...defaultProps, description: undefined },
            output: `\tpropertyName mocked: {\n\t[key in dictionaryKeyMocked]: additionalPropertiesMocked;\n};\n`,
        },
    ],
];

describe(`getResultStringForDictionaryKey`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForDictionaryKey(input);

        expect(result).toBe(output);
    });
});
