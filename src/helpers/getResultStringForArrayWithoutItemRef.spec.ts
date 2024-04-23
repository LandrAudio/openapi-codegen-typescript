import { ResultStringForArrayWithoutItemRef } from '../types';
import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';

const scenarios: [string, { input: ResultStringForArrayWithoutItemRef; output: string }][] = [
    [
        'With all props defined',
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
    ],

    [
        'MaxItems undefined',
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
    ],
    [
        'items with oneOf $ref',
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
    ],

    [
        'items with oneOf type',
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
    ],
    [
        'items type',
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
    ],

    [
        'items integer type',
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
    ],
];

describe(`getResultStringForArrayWithoutItemRef`, () => {
    it.each(scenarios)(`should return expected string when for %s`, (_, { input, output }) => {
        const result = getResultStringForArrayWithoutItemRef(input);

        expect(result).toBe(output);
    });
});
