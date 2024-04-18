import { getDictionaryValueResultString } from './getDictionaryValueResultString';

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: {
            description: 'description mocked',
            propertyName: 'propertyName mocked',
            dictionaryRef: 'dictionaryRef mocked',
            value: 'value mocked',
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked: {\n[key in dictionaryRef mocked]: value mocked;\n};\n`,
    },
    {
        scenarioName: 'Description is undefined',
        props: {
            description: undefined,
            propertyName: 'propertyName mocked',
            dictionaryRef: 'dictionaryRef mocked',
            value: 'value mocked',
        },
        expected: `\tpropertyName mocked: {\n[key in dictionaryRef mocked]: value mocked;\n};\n`,
    },
];

describe(`getDictionaryValueResultString`, () => {
    scenarios.forEach(config => {
        it(`should return ${config.expected} when description is ${config.scenarioName}`, async () => {
            const result = getDictionaryValueResultString(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
