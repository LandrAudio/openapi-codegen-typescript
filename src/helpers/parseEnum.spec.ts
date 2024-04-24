import { ParseProps } from '../types';
import { parseEnum } from './parseEnum';

const defaultSchema = {
    type: 'string',
    description: 'description mocked',
    'x-enumNames': ['Audio', 'Video', 'Image', 'Youtube'],
    enum: ['Audio', 'Video', 'Image', 'Youtube'],
};

const scenarios: { input: ParseProps; output: string }[] = [
    {
        input: { schema: defaultSchema, schemaKey: 'AssetType' },
        output: `/**\n * description mocked\n */\nexport type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
    },

    {
        input: { schema: { ...defaultSchema, description: '' }, schemaKey: 'AssetType' },
        output: `export type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = parseEnum(input);

    expect(result).toBe(output);
});
