import { ResultStringForDictionaryKey } from '../types';
import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';

const defaultProps = {
    xDictionaryKey: { $ref: 'path/dictionaryKeyMocked' },
    additionalProperties: { $ref: 'path/additionalPropertiesMocked' },
    description: 'description mocked',
    propertyName: 'propertyName mocked',
};

const scenarios: { input: ResultStringForDictionaryKey; output: string }[] = [
    {
        input: defaultProps,
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n\t[key in dictionaryKeyMocked]: additionalPropertiesMocked;\n};\n`,
    },

    {
        input: { ...defaultProps, description: undefined },
        output: `\tpropertyName mocked: {\n\t[key in dictionaryKeyMocked]: additionalPropertiesMocked;\n};\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForDictionaryKey(input);

    expect(result).toBe(output);
});
