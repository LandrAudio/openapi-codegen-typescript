import { ParseProps } from '../types';
import { parseEnum } from './parseEnum';

const defaultSchema = {
    type: 'string',
    description: 'description mocked',
    'x-enumNames': ['Audio', 'Video', 'Image', 'Youtube'],
    enum: ['Audio', 'Video', 'Image', 'Youtube'],
};

const scenarios: [string, { input: ParseProps; output: string }][] = [
    [
        'With all props defined',
        {
            input: { schema: defaultSchema, schemaKey: 'AssetType' },
            output: `/**\n * description mocked\n */\nexport type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
        },
    ],
    [
        'With all props defined',
        {
            input: { schema: { ...defaultSchema, description: '' }, schemaKey: 'AssetType' },
            output: `export type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
        },
    ],
];

describe(`parseEnum`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = parseEnum(input);

        expect(result).toBe(output);
    });
});
