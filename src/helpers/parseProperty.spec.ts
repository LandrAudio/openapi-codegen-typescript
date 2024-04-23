import { SchemaProperties } from '../types';
import { parseProperty } from './parseProperty';

const scenarios: [
    string,
    { input: Pick<SchemaProperties, 'propertyName' | 'description' | 'nullable'>; output: string },
][] = [
    [
        'With all props defined',
        {
            input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: true },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: `,
        },
    ],
    [
        'Description undefined',
        {
            input: { propertyName: 'propertyName mocked', description: undefined, nullable: true },
            output: `\tpropertyName mocked?: `,
        },
    ],
    [
        'Nullable is false',
        {
            input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: false },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: `,
        },
    ],
];

describe(`parseProperty`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = parseProperty(input);

        expect(result).toBe(output);
    });
});
