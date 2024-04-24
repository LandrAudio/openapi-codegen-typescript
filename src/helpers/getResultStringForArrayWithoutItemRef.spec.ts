import { ResultStringForArrayWithoutItemRef } from '../types';
import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';

const scenarios: { input: ResultStringForArrayWithoutItemRef; output: string }[] = [
    {
        input: {
            items: ['items mocked'],
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: any[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        input: {
            items: ['items mocked'],
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: undefined,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: any[];format: "format mocked"\n`,
    },
    {
        input: {
            items: {
                oneOf: [
                    {
                        $ref: '$ref mocked',
                    },
                ],
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: $ref mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        input: {
            items: {
                oneOf: [
                    {
                        $ref: '$ref mocked',
                        type: 'oneOf type mocked',
                    },
                ],
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: $ref mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        input: {
            items: {
                type: 'item type mocked',
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: item type mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        input: {
            items: {
                type: 'integer',
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        output: `/**\n * description mocked\n */\n\tpropertyName mocked?: number[];format: "format mocked" // maxItems: 10\n`,
    },
];

it.each(scenarios)(`should return expected string`, ({ input, output }) => {
    const result = getResultStringForArrayWithoutItemRef(input);

    expect(result).toBe(output);
});
