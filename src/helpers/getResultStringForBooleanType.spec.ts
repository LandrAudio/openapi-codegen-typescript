import { ResultStringProps } from '../types';
import { getResultStringForBooleanType } from './getResultStringForBooleanType';

const scenarios: { input: ResultStringProps; output: string }[] = [
    {
        input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: true },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: boolean;\n`,
    },
    {
        input: { propertyName: 'propertyName mocked', description: undefined, nullable: true },
        output: `\tpropertyName mocked?: boolean;\n`,
    },
    {
        input: { propertyName: 'propertyName mocked', description: 'description mocked', nullable: false },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked: boolean;\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForBooleanType(input);

    expect(result).toBe(output);
});
