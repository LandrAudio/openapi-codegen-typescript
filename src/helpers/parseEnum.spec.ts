import { parseEnum } from './parseEnum';

const defaultSchema = {
    type: 'string',
    description: 'description mocked',
    'x-enumNames': ['Audio', 'Video', 'Image', 'Youtube'],
    enum: ['Audio', 'Video', 'Image', 'Youtube'],
};

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: { schema: defaultSchema, schemaKey: 'AssetType' },
        expected: `/**\n * description mocked \n */\nexport type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
    },
    {
        scenarioName: 'With all props defined',
        props: { schema: { ...defaultSchema, description: '' }, schemaKey: 'AssetType' },
        expected: `export type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
    },
];

describe(`getDescription`, () => {
    scenarios.forEach(config => {
        it(`should return expected string for ${config.scenarioName}`, async () => {
            const result = parseEnum(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
