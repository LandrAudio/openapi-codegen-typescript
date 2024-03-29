import {
    combineProperties,
    convertToMocks,
    getSchemaInterfaces,
    parseSchema,
    parseSchemas,
} from '../src/mockConverter';
import { aSwaggerV2Mock, aSwaggerV3Mock } from '../src/utils/test-utils';

jest.mock('fs');

const fs = require('fs');

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

it('should generate array of numbers type', async () => {
    const schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            data: {
                type: 'array',
                nullable: true,
                items: {
                    type: 'number',
                    format: 'double',
                },
            },
        },
    };

    const result = parseSchema({ schema, name: 'VisualizationDto' });

    const expectedString = `
export const aVisualizationDtoAPI = (overrides?: Partial<VisualizationDto>): VisualizationDto => {
  return {
    data: [88.24278227984905,107.01676551252604],
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

    const result = getSchemaInterfaces(schema, {});
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

it('should generate duration format', async () => {
    const schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            duration: {
                type: 'string',
                format: 'duration',
            },
        },
    };

    const result = parseSchema({ schema, name: 'Dates' });

    const expectedString = `
export const aDatesAPI = (overrides?: Partial<Dates>): Dates => {
  return {
    duration: '902',
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

    const json = aSwaggerV3Mock({
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
    });

    const result = parseSchemas({ json });

    const expectedString = `
export const aOneAPI = (overrides?: Partial<One>): One => {
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
    const json = aSwaggerV3Mock({
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
    });

    const result = await convertToMocks({
        json,
        fileName: 'doesnt matter',
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {One, Two} from './pathToTypes';

export const aOneAPI = (overrides?: Partial<One>): One => {
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

it('should generate mocks for "InviteAssetsMembersRequestDto" (multiple extends)', async () => {
    const json = aSwaggerV3Mock({
        MembersEmailDto: {
            type: 'object',
            additionalProperties: false,
            required: ['members'],
            properties: {
                members: {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/MemberEmailDto',
                    },
                },
            },
        },
        UserRole: {
            type: 'string',
            description: '',
            'x-enumNames': ['Owner', 'Collaborator', 'Viewer'],
            enum: ['Owner', 'Collaborator', 'Viewer'],
        },
        InviteMembersRequestDto: {
            allOf: [
                {
                    $ref: '#/components/schemas/MembersEmailDto',
                },
                {
                    type: 'object',
                    additionalProperties: false,
                    required: ['role'],
                    properties: {
                        message: {
                            type: 'string',
                            maxLength: 5000,
                            nullable: true,
                        },
                        role: {
                            $ref: '#/components/schemas/UserRole',
                        },
                    },
                },
            ],
        },
        InviteAssetsMembersRequestDto: {
            allOf: [
                {
                    $ref: '#/components/schemas/InviteMembersRequestDto',
                },
                {
                    type: 'object',
                    additionalProperties: false,
                    required: ['assetIds'],
                    properties: {
                        assetIds: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'guid',
                            },
                        },
                    },
                },
            ],
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {MembersEmailDto, UserRole, InviteMembersRequestDto, InviteAssetsMembersRequestDto} from './pathToTypes';

export const aMembersEmailDtoAPI = (overrides?: Partial<MembersEmailDto>): MembersEmailDto => {
  return {
    members: overrides?.members || [aMemberEmailDtoAPI()],
  ...overrides,
  };
};

export const anInviteMembersRequestDtoAPI = (overrides?: Partial<InviteMembersRequestDto>): InviteMembersRequestDto => {
  return {
    message: 'message-invitemembersrequestdto',
  role: 'Owner',
  members: overrides?.members || [aMemberEmailDtoAPI()],
  ...overrides,
  };
};

export const anInviteAssetsMembersRequestDtoAPI = (overrides?: Partial<InviteAssetsMembersRequestDto>): InviteAssetsMembersRequestDto => {
  return {
    assetIds: ['officiis'],
  members: overrides?.members || [aMemberEmailDtoAPI()],
  message: 'message-inviteassetsmembersrequestdto',
  role: 'Owner',
  ...overrides,
  };
};
 
`;

    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for "MemberEmailDto" (email property)', async () => {
    const json = aSwaggerV3Mock({
        MemberEmailDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                email: {
                    type: 'string',
                    format: 'email',
                    nullable: true,
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {MemberEmailDto} from './pathToTypes';

export const aMemberEmailDtoAPI = (overrides?: Partial<MemberEmailDto>): MemberEmailDto => {
  return {
    email: 'Destiney.Raynor@Charlie.biz',
  ...overrides,
  };
};
 
`;

    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for "Comment" (duration property)', async () => {
    const json = aSwaggerV3Mock({
        Comment: {
            type: 'object',
            additionalProperties: false,
            properties: {
                id: {
                    type: 'string',
                    format: 'guid',
                },
                message: {
                    type: 'string',
                    nullable: true,
                },
                userId: {
                    type: 'string',
                    format: 'guid',
                },
                annotationTime: {
                    type: 'string',
                    format: 'time-span',
                    nullable: true,
                },
                annotationDuration: {
                    type: 'string',
                    format: 'time-span',
                    nullable: true,
                },
                creationTime: {
                    type: 'string',
                    format: 'date-time',
                },
                lastModifiedTime: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Comment} from './pathToTypes';

export const aCommentAPI = (overrides?: Partial<Comment>): Comment => {
  return {
    id: '6046ffb2-6bf2-4352-8bd1-399138ba33c0',
  message: 'message-comment',
  userId: '768bbcf6-0bde-4398-9859-3e2eb664e6f7',
  annotationTime: '2019-06-10T06:20:01.389Z',
  annotationDuration: '2019-06-10T06:20:01.389Z',
  creationTime: '2019-06-10T06:20:01.389Z',
  lastModifiedTime: '2019-06-10T06:20:01.389Z',
  ...overrides,
  };
};
 
`;

    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for array of integers', async () => {
    const json = aSwaggerV3Mock({
        ArrayOfIntegers: {
            type: 'object',
            additionalProperties: false,
            properties: {
                invoiceNumbers: {
                    type: 'array',
                    nullable: true,
                    items: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ArrayOfIntegers} from './pathToTypes';

export const anArrayOfIntegersAPI = (overrides?: Partial<ArrayOfIntegers>): ArrayOfIntegers => {
  return {
    invoiceNumbers: [-389,464],
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for a property without a "type"', async () => {
    const json = aSwaggerV3Mock({
        Notification: {
            type: 'object',
            additionalProperties: false,
            properties: {
                payload: {
                    nullable: true,
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Notification} from './pathToTypes';

export const aNotificationAPI = (overrides?: Partial<Notification>): Notification => {
  return {
    payload: 'payload',
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for a enum "dictionary" type', async () => {
    const json = aSwaggerV3Mock({
        BillingProviderKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['Legacy', 'Fusebill'],
            enum: ['Legacy', 'Fusebill'],
        },
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution'],
        },
        UserMetadata: {
            type: 'object',
            additionalProperties: false,
            properties: {
                serviceOffers: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/ServiceOfferKind',
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/BillingProviderKind',
                    },
                },
                copy: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/ServiceOfferKind',
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/BillingProviderKind',
                    },
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {BillingProviderKind, ServiceOfferKind, UserMetadata} from './pathToTypes';

export const anUserMetadataAPI = (overrides?: Partial<UserMetadata>): UserMetadata => {
  return {
    serviceOffers: { 
"MasteringAndDistribution": "Legacy",
"Video": "Legacy",
"Samples": "Legacy",
"Mastering": "Legacy",
"Distribution": "Legacy",
},
  copy: { 
"MasteringAndDistribution": "Legacy",
"Video": "Legacy",
"Samples": "Legacy",
"Mastering": "Legacy",
"Distribution": "Legacy",
},
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for an object "dictionary" type', async () => {
    const json = aSwaggerV3Mock({
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution'],
        },
        CurrentSubscription: {
            type: 'object',
            additionalProperties: false,
            properties: {
                creationDate: {
                    type: 'string',
                    format: 'date-time',
                },
                activationDate: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                },
            },
        },
        NextSubscription: {
            type: 'object',
            additionalProperties: false,
            properties: {
                startDate: {
                    type: 'string',
                    format: 'date-time',
                },
            },
        },
        UserSubscriptions: {
            type: 'object',
            additionalProperties: false,
            properties: {
                current: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/ServiceOfferKind',
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/CurrentSubscription',
                    },
                },
                next: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/ServiceOfferKind',
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/NextSubscription',
                    },
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ServiceOfferKind, CurrentSubscription, NextSubscription, UserSubscriptions} from './pathToTypes';

export const aCurrentSubscriptionAPI = (overrides?: Partial<CurrentSubscription>): CurrentSubscription => {
  return {
    creationDate: '2019-06-10T06:20:01.389Z',
  activationDate: '2019-06-10T06:20:01.389Z',
  ...overrides,
  };
};

export const aNextSubscriptionAPI = (overrides?: Partial<NextSubscription>): NextSubscription => {
  return {
    startDate: '2019-06-10T06:20:01.389Z',
  ...overrides,
  };
};

export const anUserSubscriptionsAPI = (overrides?: Partial<UserSubscriptions>): UserSubscriptions => {
  return {
    current: { 
"MasteringAndDistribution": aCurrentSubscriptionAPI(),
"Video": aCurrentSubscriptionAPI(),
"Samples": aCurrentSubscriptionAPI(),
"Mastering": aCurrentSubscriptionAPI(),
"Distribution": aCurrentSubscriptionAPI(),
},
  next: { 
"MasteringAndDistribution": aNextSubscriptionAPI(),
"Video": aNextSubscriptionAPI(),
"Samples": aNextSubscriptionAPI(),
"Mastering": aNextSubscriptionAPI(),
"Distribution": aNextSubscriptionAPI(),
},
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for a "dictionary" type boolean', async () => {
    const json = aSwaggerV3Mock({
        ContentDtoOfCollectionDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                data: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/CollectionDto',
                    },
                },
                paging: {
                    nullable: true,
                    oneOf: [
                        {
                            $ref: '#/components/schemas/PagingOptionsDto',
                        },
                    ],
                },
            },
        },
        CollectionDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                id: {
                    type: 'string',
                    format: 'guid',
                },
                ownerId: {
                    type: 'string',
                    format: 'guid',
                },
                name: {
                    type: 'string',
                    nullable: true,
                },
                creationTime: {
                    type: 'string',
                    format: 'date-time',
                },
                lastModifiedTime: {
                    type: 'string',
                    format: 'date-time',
                },
                isSoftDeleted: {
                    type: 'boolean',
                },
                collaborators: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/CollaboratorDto',
                    },
                },
                permissions: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/UserOperation',
                    },
                    additionalProperties: {
                        type: 'boolean',
                    },
                },
            },
        },
        UserOperation: {
            type: 'string',
            description: '',
            'x-enumNames': ['Read', 'Write'],
            enum: ['Read', 'Write'],
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ContentDtoOfCollectionDto, CollectionDto, UserOperation} from './pathToTypes';

export const aContentDtoOfCollectionDtoAPI = (overrides?: Partial<ContentDtoOfCollectionDto>): ContentDtoOfCollectionDto => {
  return {
    data: overrides?.data || [aCollectionDtoAPI()],
  paging: overrides?.paging || aPagingOptionsDtoAPI(),
  ...overrides,
  };
};

export const aCollectionDtoAPI = (overrides?: Partial<CollectionDto>): CollectionDto => {
  return {
    id: '1da66002-f19b-4da7-8651-9536fd6b9485',
  ownerId: 'fe1413ec-e62e-4599-9b0a-d164323fe7b1',
  name: 'name-collectiondto',
  creationTime: '2019-06-10T06:20:01.389Z',
  lastModifiedTime: '2019-06-10T06:20:01.389Z',
  isSoftDeleted: true,
  collaborators: overrides?.collaborators || [aCollaboratorDtoAPI()],
  permissions: { 
"Read": true,
"Write": true,
},
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should generate overrided mocks for dictionary enum type', async () => {
    const json = aSwaggerV3Mock({
        UserMetadata: {
            type: 'object',
            additionalProperties: false,
            properties: {
                serviceOffers: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/ServiceOfferKind',
                    },
                    additionalProperties: {
                        $ref: '#/components/schemas/BillingProviderKind',
                    },
                },
            },
        },
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
        },
        BillingProviderKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['Legacy', 'Fusebill'],
            enum: ['Legacy', 'Fusebill'],
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserMetadata, ServiceOfferKind, BillingProviderKind} from './pathToTypes';

export const anUserMetadataAPI = (overrides?: Partial<UserMetadata>): UserMetadata => {
  return {
    serviceOffers: { 
"masteringAndDistribution": "Legacy",
"video": "Legacy",
"samples": "Legacy",
"mastering": "Legacy",
"distribution": "Legacy",
"sessions": "Legacy",
},
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
        overrideSchemas: [
            {
                ServiceOfferKind: {
                    type: 'string',
                    description: 'Warning! This type is overrided',
                    enum: ['masteringAndDistribution', 'video', 'samples', 'mastering', 'distribution', 'sessions'],
                },
            },
        ],
    });

    expect(result).toEqual(expected);
});

it('should generate overrided mocks for oneOf enum type', async () => {
    const json = aSwaggerV3Mock({
        CurrentSubscription: {
            type: 'object',
            additionalProperties: false,
            properties: {
                serviceOffer: {
                    description: 'the service offer of the subscription.',
                    oneOf: [
                        {
                            $ref: '#/components/schemas/ServiceOfferKind',
                        },
                    ],
                },
            },
        },
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {CurrentSubscription, ServiceOfferKind} from './pathToTypes';

export const aCurrentSubscriptionAPI = (overrides?: Partial<CurrentSubscription>): CurrentSubscription => {
  return {
    serviceOffer: 'masteringAndDistribution',
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
        overrideSchemas: [
            {
                ServiceOfferKind: {
                    type: 'string',
                    description: 'Warning! This type is overrided',
                    enum: ['masteringAndDistribution', 'video', 'samples', 'mastering', 'distribution', 'sessions'],
                },
            },
        ],
    });

    expect(result).toEqual(expected);
});

it('should generate overrided mocks for $ref enum type', async () => {
    const json = aSwaggerV3Mock({
        NextSubscription: {
            type: 'object',
            additionalProperties: false,
            properties: {
                serviceOffer: {
                    $ref: '#/components/schemas/ServiceOfferKind',
                },
            },
        },
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextSubscription, ServiceOfferKind} from './pathToTypes';

export const aNextSubscriptionAPI = (overrides?: Partial<NextSubscription>): NextSubscription => {
  return {
    serviceOffer: 'masteringAndDistribution',
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
        overrideSchemas: [
            {
                ServiceOfferKind: {
                    type: 'string',
                    description: 'Warning! This type is overrided',
                    enum: ['masteringAndDistribution', 'video', 'samples', 'mastering', 'distribution', 'sessions'],
                },
            },
        ],
    });

    expect(result).toEqual(expected);
});

it('should generate mocks for a URI type', async () => {
    const json = aSwaggerV3Mock({
        DownloadDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                url: {
                    type: 'string',
                    format: 'uri',
                    nullable: true,
                },
            },
        },
    });

    const expected = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {DownloadDto} from './pathToTypes';

export const aDownloadDtoAPI = (overrides?: Partial<DownloadDto>): DownloadDto => {
  return {
    url: 'http://www.Wisozk.us/',
  ...overrides,
  };
};
 
`;
    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    expect(result).toEqual(expected);
});

it('should return CollectionResponseDto mocks', async () => {
    const json = aSwaggerV2Mock({
        'CollectionResponseDto[StoredCreditCardDto]': {
            title: 'CollectionResponse`1',
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        $ref: '#/definitions/StoredCreditCardDto',
                    },
                },
            },
        },
        StoredCreditCardDto: {
            title: 'StoredCreditCard',
            type: 'object',
            properties: {
                creditCardId: {
                    type: 'string',
                },
            },
        },
    });

    const result = await convertToMocks({
        json,
        fileName: "doesn't matter",
        folderPath: './someFolder',
        typesPath: './pathToTypes',
    });

    const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {CollectionResponseDto, StoredCreditCardDto} from './pathToTypes';

export const aCollectionResponseDtoAPI = (overrides?: Partial<CollectionResponseDto>): CollectionResponseDto => {
  return {
    data: overrides?.data || [aStoredCreditCardDtoAPI()],
  ...overrides,
  };
};

export const aStoredCreditCardDtoAPI = (overrides?: Partial<StoredCreditCardDto>): StoredCreditCardDto => {
  return {
    creditCardId: 'creditCardId-storedcreditcarddto',
  ...overrides,
  };
};
 
`;
    expect(result).toEqual(expectedString);
});

describe('Dictionary type', () => {
    it('should generate mock for integer values', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                properties: {
                    states: {
                        type: 'object',
                        nullable: true,
                        'x-dictionaryKey': {
                            $ref: '#/components/schemas/ProductState',
                        },
                        additionalProperties: {
                            type: 'integer',
                            format: 'int32',
                        },
                    },
                },
            },
            ProductState: {
                type: 'string',
                description: '',
                'x-enumNames': ['Draft', 'ConfirmDraft'],
                enum: ['Draft', 'ConfirmDraft'],
            },
        });

        const result = await convertToMocks({
            json,
            fileName: "doesn't matter",
            folderPath: './someFolder',
            typesPath: './pathToTypes',
        });

        const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {GlobalStateCounters, ProductState} from './pathToTypes';

export const aGlobalStateCountersAPI = (overrides?: Partial<GlobalStateCounters>): GlobalStateCounters => {
  return {
    states: { 
"Draft": 14,
"ConfirmDraft": 56,
},
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate mock for number values', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                properties: {
                    states: {
                        type: 'object',
                        nullable: true,
                        'x-dictionaryKey': {
                            $ref: '#/components/schemas/ProductState',
                        },
                        additionalProperties: {
                            type: 'number',
                        },
                    },
                },
            },
            ProductState: {
                type: 'string',
                description: '',
                'x-enumNames': ['Draft', 'ConfirmDraft'],
                enum: ['Draft', 'ConfirmDraft'],
            },
        });

        const result = await convertToMocks({
            json,
            fileName: "doesn't matter",
            folderPath: './someFolder',
            typesPath: './pathToTypes',
        });

        const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {GlobalStateCounters, ProductState} from './pathToTypes';

export const aGlobalStateCountersAPI = (overrides?: Partial<GlobalStateCounters>): GlobalStateCounters => {
  return {
    states: { 
"Draft": 13.546639564447105,
"ConfirmDraft": 55.710112932138145,
},
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate mock for string values', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                properties: {
                    states: {
                        type: 'object',
                        nullable: true,
                        'x-dictionaryKey': {
                            $ref: '#/components/schemas/ProductState',
                        },
                        additionalProperties: {
                            type: 'string',
                        },
                    },
                },
            },
            ProductState: {
                type: 'string',
                description: '',
                'x-enumNames': ['Draft', 'ConfirmDraft'],
                enum: ['Draft', 'ConfirmDraft'],
            },
        });

        const result = await convertToMocks({
            json,
            fileName: "doesn't matter",
            folderPath: './someFolder',
            typesPath: './pathToTypes',
        });

        const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {GlobalStateCounters, ProductState} from './pathToTypes';

export const aGlobalStateCountersAPI = (overrides?: Partial<GlobalStateCounters>): GlobalStateCounters => {
  return {
    states: { 
"Draft": eos iste consequatur delectus sit veniam in,
"ConfirmDraft": laborum voluptas molestiae ad architecto praesentium rerum,
},
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate TODO error value if "additionalProperties" is wrong', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                properties: {
                    states: {
                        type: 'object',
                        nullable: true,
                        'x-dictionaryKey': {
                            $ref: '#/components/schemas/ProductState',
                        },
                        additionalProperties: {
                            somethingIsWrong: 'error',
                        },
                    },
                },
            },
            ProductState: {
                type: 'string',
                description: '',
                'x-enumNames': ['Draft', 'ConfirmDraft'],
                enum: ['Draft', 'ConfirmDraft'],
            },
        });

        const result = await convertToMocks({
            json,
            fileName: "doesn't matter",
            folderPath: './someFolder',
            typesPath: './pathToTypes',
        });

        const expectedString = `/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {GlobalStateCounters, ProductState} from './pathToTypes';

export const aGlobalStateCountersAPI = (overrides?: Partial<GlobalStateCounters>): GlobalStateCounters => {
  return {
    states: { 
"Draft": " // TODO: Wrong dictionary value",
"ConfirmDraft": " // TODO: Wrong dictionary value",
},
  ...overrides,
  };
};
 
`;
        expect(result).toEqual(expectedString);
    });

    it('should generate mocks for a "dictionary" type array', async () => {
        const json = aSwaggerV3Mock({
            ComplexDto: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: {
                  type: 'string',
                  nullable: true
                }
              }
            },
            MainDto: {
              type: 'object',
              additionalProperties: false,
              properties: {
                contributors: {
                  type: 'object',
                  nullable: true,
                  'x-dictionaryKey': {
                    $ref: '#/components/schemas/Role'
                  },
                  additionalProperties: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/ComplexDto'
                    }
                  }
                }
              }
            },
            Role: {
              type: 'string',
              'x-enumNames': [
                'Role1',
                'Role2',
                'Role3'
              ],
              enum: [
                'role1',
                'role2',
                'role3'
              ]
            },
        });

        const result = await convertToMocks({
            json,
            fileName: "doesn't matter",
            folderPath: './someFolder',
            typesPath: './pathToTypes',
        });

        expect(result).toMatchSnapshot();
    });
});
