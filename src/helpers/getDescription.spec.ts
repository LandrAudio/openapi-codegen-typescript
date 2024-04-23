import { SchemaProperties } from '../types';
import { getDescription } from './getDescription';

const scenarios: { input: Pick<SchemaProperties, 'description'>; output: string }[] = [
    { input: { description: 'mock description' }, output: `/**\n * mock description\n */\n` },
    { input: { description: undefined }, output: '' },
];

it.each(scenarios)(`should %s`, ({ input, output }) => {
    const result = getDescription(input);

    expect(result).toBe(output);
});
