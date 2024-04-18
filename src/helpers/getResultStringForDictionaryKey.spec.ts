import { getResultStringForDictionaryKey } from './getResultStringForDictionaryKey';

const defaultProps = {
    xDictionaryKey: { $ref: 'path/dictionaryKeyMocked' },
    additionalProperties: { $ref: 'path/additionalPropertiesMocked' },
    description: 'description mocked',
    propertyName: 'propertyName mocked',
};

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: defaultProps,
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n[key in dictionaryKeyMocked]: additionalPropertiesMocked; \n }; \n`,
    },
    {
        scenarioName: 'Description undefined',
        props: { ...defaultProps, description: undefined },
        expected: `\tpropertyName mocked: {\n[key in dictionaryKeyMocked]: additionalPropertiesMocked; \n }; \n`,
    },
];

describe(`getResultStringForDictionaryKey`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForDictionaryKey(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
