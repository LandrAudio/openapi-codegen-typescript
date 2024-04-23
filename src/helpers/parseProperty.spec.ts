import { SchemaProperties } from '../types';
import { parseProperty } from './parseProperty';

const scenarios: { input: Pick<SchemaProperties, 'propertyName' | 'description' | 'nullable'>; output: string }[] = [
    {
        input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: true },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: `,
    },

    {
        input: { propertyName: 'propertyName mocked', description: undefined, nullable: true },
        output: `\tpropertyName mocked?: `,
    },

    {
        input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: false },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: `,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = parseProperty(input);

    expect(result).toBe(output);
});
