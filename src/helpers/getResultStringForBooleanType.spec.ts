import { ResultStringProps } from '../types';
import { getResultStringForBooleanType } from './getResultStringForBooleanType';

const scenarios: [string, { input: ResultStringProps; output: string }][] = [
    [
        'With all props defined',
        {
            input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: true },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked?: boolean;\n`,
        },
    ],
    [
        'Description undefined',
        {
            input: { propertyName: 'propertyName mocked', description: undefined, nullable: true },
            output: `\tpropertyName mocked?: boolean;\n`,
        },
    ],
    [
        'Nullable is false',
        {
            input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: false },
            output: `/**\n * description mocked\n */\n\tpropertyName mocked: boolean;\n`,
        },
    ],
];

describe(`getResultStringForBooleanType`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForBooleanType(input);

        expect(result).toBe(output);
    });
});
