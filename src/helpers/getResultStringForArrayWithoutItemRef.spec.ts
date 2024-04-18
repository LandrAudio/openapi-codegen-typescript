import { getResultStringForArrayWithoutItemRef } from './getResultStringForArrayWithoutItemRef';

const scenarios = [
    {
        scenarioName: 'With all props defined',
        props: {
            items: ['items mocked'],
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: any[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        scenarioName: 'MaxItems undefined',
        props: {
            items: ['items mocked'],
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: undefined,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: any[];format: "format mocked"\n`,
    },
    {
        scenarioName: 'items with oneOf $ref',
        props: {
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
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: $ref mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        scenarioName: 'items with oneOf type',
        props: {
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
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: $ref mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        scenarioName: 'items type',
        props: {
            items: {
                type: 'item type mocked',
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: item type mocked[];format: "format mocked" // maxItems: 10\n`,
    },
    {
        scenarioName: 'items integer type',
        props: {
            items: {
                type: 'integer',
            },
            propertyName: 'propertyName mocked',
            description: 'description mocked',
            nullable: true,
            format: 'format mocked',
            maxItems: 10,
        },
        expected: `/**\n * description mocked\n */\n\tpropertyName mocked?: number[];format: "format mocked" // maxItems: 10\n`,
    },
];

describe(`getResultStringForArrayWithoutItemRef`, () => {
    scenarios.forEach(config => {
        it(`should return expected string when for ${config.scenarioName}`, async () => {
            const result = getResultStringForArrayWithoutItemRef(config.props);

            expect(result).toBe(config.expected);
        });
    });
});
