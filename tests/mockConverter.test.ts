import {
    combineProperties,
    convertToMocks,
    getSchemaInterfaces,
    parseSchema,
    parseSchemas,
} from '../src/mockConverter';
jest.mock('fs');

const fs = require('fs');

describe('Mock generation', () => {
    it('should generate number type', async () => {
        const schema = {
            type: 'object',
            additionalProperties: false,
            required: ['serviceType', 'price'],
            properties: {
                price: {
                    type: 'number',
                    format: 'decimal',
                    minimum: 0,
                    maximum: 100,
                },
            },
        };

        const result = parseSchema({ schema, name: 'ServiceTypeDto' });

        const expectedString = `
export const aServiceTypeDtoAPI = (overrides?: Partial<ServiceTypeDto>): ServiceTypeDto => {
  return {
    price: 11.842845170758665,
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should get interfaces', async () => {
        const schema = {
            allOf: [
                {
                    $ref: '#/components/schemas/One',
                },
                {
                    $ref: '#/components/schemas/Two',
                },
                {
                    type: 'object',
                    properties: {},
                },
            ],
        };

        const result = getSchemaInterfaces(schema);
        expect(result).toEqual(['One', 'Two']);
    });

    it('should combine props from interfaces', async () => {
        const DTOs = {
            One: {
                properties: {
                    name: {
                        type: 'string',
                        nullable: 'true',
                    },
                },
            },
            Two: {
                properties: {
                    price: {
                        type: 'number',
                        format: 'decimal',
                    },
                },
            },
        };

        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                dateTime: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        };

        const result = combineProperties({ schema, schemas: DTOs, interfaces: ['One', 'Two'] });

        expect(result).toEqual({
            type: 'object',
            additionalProperties: false,
            properties: {
                dateTime: {
                    type: 'string',
                    format: 'date-time',
                },
                name: {
                    type: 'string',
                    nullable: 'true',
                },
                price: {
                    type: 'number',
                    format: 'decimal',
                },
            },
        });
    });

    it('should generate date-time format', async () => {
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                dateTime: {
                    type: 'string',
                    format: 'date-time',
                },
                date: {
                    type: 'string',
                    format: 'date',
                },
            },
        };

        const result = parseSchema({ schema, name: 'Dates' });

        const expectedString = `
export const aDatesAPI = (overrides?: Partial<Dates>): Dates => {
  return {
    dateTime: '2019-06-10T06:20:01.389Z',
  date: '2019-06-10',
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate boolean type', async () => {
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                canAccept: {
                    type: 'boolean',
                },
            },
        };

        const result = parseSchema({ schema, name: 'Boolean' });

        const expectedString = `
export const aBooleanAPI = (overrides?: Partial<Boolean>): Boolean => {
  return {
    canAccept: true,
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate array types', async () => {
        const DTOs = {
            PriceTier: {
                type: 'string',
                description: '',
                'x-enumNames': ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
                enum: ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
            },
        };
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                refType: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/AssetDto',
                    },
                },
                oneOf: {
                    type: 'array',
                    nullable: true,
                    items: {
                        nullable: true,
                        oneOf: [
                            {
                                $ref: '#/components/schemas/PriceTier',
                            },
                        ],
                    },
                },
                simpleType: {
                    type: 'array',
                    nullable: true,
                    items: {
                        type: 'string',
                    },
                },
                maxItems: {
                    type: 'array',
                    maxItems: 5,
                    nullable: true,
                    items: {
                        type: 'string',
                    },
                },
            },
        };

        const result = parseSchema({ schema, name: 'Dates', DTOs });

        const expectedString = `
export const aDatesAPI = (overrides?: Partial<Dates>): Dates => {
  return {
    refType: overrides?.refType || [anAssetDtoAPI()],
  oneOf: ['Community'],
  simpleType: ['pariatur'],
  maxItems: ['autem'],
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate AssetDto mocks', async () => {
        const DTO = {
            AssetType: {
                type: 'string',
                description: '',
                'x-enumNames': ['Audio', 'Video', 'Image', 'Youtube'],
                enum: ['Audio', 'Video', 'Image', 'Youtube'],
            },
        };

        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                id: {
                    type: 'string',
                    format: 'guid',
                },
                name: {
                    type: 'string',
                    nullable: true,
                },
                isConfigured: {
                    type: 'boolean',
                    nullable: true,
                },
                type: {
                    $ref: '#/components/schemas/AssetType',
                },
                files: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/AssetFileDto',
                    },
                },
            },
        };

        const result = parseSchema({
            schema,
            name: 'AssetDto',
            DTOs: DTO,
        });

        const expectedString = `
export const anAssetDtoAPI = (overrides?: Partial<AssetDto>): AssetDto => {
  return {
    id: 'b0803452-5ceb-4ba3-ba9f-0c84b4b5262f',
  name: 'name-assetdto',
  isConfigured: true,
  type: 'Audio',
  files: overrides?.files || [anAssetFileDtoAPI()],
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate mocks for extend interfaces', async () => {
        const DTOs = {
            ServiceTypeBasicDto: {
                type: 'object',
                additionalProperties: false,
                required: ['code'],
                properties: {
                    code: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            },
        };
        const schema = {
            allOf: [
                {
                    $ref: '#/components/schemas/ServiceTypeBasicDto',
                },
                {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        serviceCategory: {
                            nullable: true,
                            oneOf: [
                                {
                                    $ref: '#/components/schemas/ServiceCategoryDto',
                                },
                            ],
                        },
                        priceRanges: {
                            type: 'array',
                            nullable: true,
                            items: {
                                $ref: '#/components/schemas/ServiceTypePriceRangeDto',
                            },
                        },
                    },
                },
            ],
        };

        const result = parseSchema({
            schema,
            name: 'ServiceTypeDto',
            DTOs,
        });

        const expectedString = `
export const aServiceTypeDtoAPI = (overrides?: Partial<ServiceTypeDto>): ServiceTypeDto => {
  return {
    serviceCategory: overrides?.serviceCategory || aServiceCategoryDtoAPI(),
  priceRanges: overrides?.priceRanges || [aServiceTypePriceRangeDtoAPI()],
  code: 'code-servicetypedto',
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate CreateBriefDto mocks', async () => {
        const DTOs = {
            BriefType: {
                type: 'string',
                description: '',
                'x-enumNames': ['Contest', 'Landr', 'Direct'],
                enum: ['Contest', 'Landr', 'Direct'],
            },
        };
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                title: {
                    type: 'string',
                    maxLength: 255,
                    minLength: 1,
                },
                description: {
                    type: 'string',
                    maxLength: 4000,
                    minLength: 1,
                },
                briefType: {
                    $ref: '#/components/schemas/BriefType',
                },
                inspirationalLinks: {
                    type: 'array',
                    maxItems: 5,
                    nullable: true,
                    items: {
                        type: 'string',
                    },
                },
                serviceType: {
                    nullable: true,
                    oneOf: [
                        {
                            $ref: '#/components/schemas/ServiceTypeBasicDto',
                        },
                    ],
                },
                providerServiceId: {
                    type: 'string',
                    format: 'guid',
                    nullable: true,
                },
            },
        };

        const result = parseSchema({
            schema,
            name: 'CreateBriefDto',
            DTOs,
        });

        const expectedString = `
export const aCreateBriefDtoAPI = (overrides?: Partial<CreateBriefDto>): CreateBriefDto => {
  return {
    title: 'title-createbriefdto',
  description: 'description-createbriefdto',
  briefType: 'Contest',
  inspirationalLinks: ['ipsa'],
  serviceType: overrides?.serviceType || aServiceTypeBasicDtoAPI(),
  providerServiceId: '674371a6-fd8b-41b2-94f0-321c64b7e346',
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate PatchBriefDto mocks', async () => {
        const DTOs = {
            PriceTier: {
                type: 'string',
                description: '',
                'x-enumNames': ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
                enum: ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
            },
        };
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                requestedDelivery: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                },
                tiers: {
                    type: 'array',
                    nullable: true,
                    items: {
                        nullable: true,
                        oneOf: [
                            {
                                $ref: '#/components/schemas/PriceTier',
                            },
                        ],
                    },
                },
            },
        };

        const result = parseSchema({
            schema,
            name: 'PatchBriefDto',
            DTOs,
        });

        const expectedString = `
export const aPatchBriefDtoAPI = (overrides?: Partial<PatchBriefDto>): PatchBriefDto => {
  return {
    requestedDelivery: '2019-06-10T06:20:01.389Z',
  tiers: ['Community'],
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate array of enum mocks', async () => {
        const DTOs = {
            PriceTier: {
                type: 'string',
                description: '',
                'x-enumNames': ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
                enum: ['Community', 'Bronze', 'Silver', 'Gold', 'Platinum'],
            },
        };
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                tiers: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/PriceTier',
                    },
                },
            },
        };

        const result = parseSchema({
            schema,
            name: 'PatchBriefDto',
            DTOs,
        });

        const expectedString = `
export const aPatchBriefDtoAPI = (overrides?: Partial<PatchBriefDto>): PatchBriefDto => {
  return {
    tiers: ['Community'],
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate mocks for CreateServiceDto', async () => {
        const DTOs = {
            ServiceTypeBasicDto: {
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            },
        };
        const schema = {
            type: 'object',
            properties: {
                serviceType: {
                    $ref: '#/components/schemas/ServiceTypeBasicDto',
                },
            },
        };

        const result = parseSchema({
            schema,
            name: 'CreateServiceDto',
            DTOs,
        });

        const expectedString = `
export const aCreateServiceDtoAPI = (overrides?: Partial<CreateServiceDto>): CreateServiceDto => {
  return {
    serviceType: overrides?.serviceType || aServiceTypeBasicDtoAPI(),
  ...overrides,
  };
};
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly parse schemas', async () => {
        fs.existsSync.mockReturnValue(false);
        fs.mkdirSync.mockReturnValue(false);

        const json = {
            paths: {},
            servers: {},
            info: {},
            components: {
                schemas: {
                    One: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                        },
                    },
                    Two: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        };

        const result = parseSchemas({ json, swaggerVersion: 3 });

        const expectedString = `
export const anOneAPI = (overrides?: Partial<One>): One => {
  return {
    name: 'name-one',
  ...overrides,
  };
};

export const aTwoAPI = (overrides?: Partial<Two>): Two => {
  return {
    name: 29.84020493226126,
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });

    it('should convert to mocks hole json object', async () => {
        const json = {
            paths: {},
            servers: {},
            info: {},
            components: {
                schemas: {
                    One: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                        },
                    },
                    Two: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'number',
                            },
                        },
                    },
                },
            },
        };

        const result = await convertToMocks({
            json,
            fileName: 'doesnt matter',
            folderPath: './someFolder',
            typesPath: './pathToTypes',
            swaggerVersion: 3,
        });

        const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {One, Two} from './pathToTypes';

export const anOneAPI = (overrides?: Partial<One>): One => {
  return {
    name: 'name-one',
  ...overrides,
  };
};

export const aTwoAPI = (overrides?: Partial<Two>): Two => {
  return {
    name: 29.84020493226126,
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });
});
