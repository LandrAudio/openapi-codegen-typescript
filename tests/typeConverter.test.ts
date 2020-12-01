import { parseEnum, parseObject, parseSchemas } from '../src/typesConverter';

describe('TS types generation', () => {
    it('should convert id guid property', async () => {
        const schema = {
            type: 'object',
            properties: {
                id: { format: 'guid', type: 'string' },
            },
        };

        const result = parseObject({ schema, schemaKey: 'TypeWithId' });

        const expectedString = `export interface TypeWithId {
    id: string; // format: "guid"
}
`;
        expect(result).toEqual(expectedString);
    });

    it('convert number type props', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            required: ['serviceType', 'price'],
            properties: {
                price: {
                    type: 'number',
                    format: 'decimal',
                    minimum: 0,
                    maximum: 100,
                    exclusiveMinimum: true,
                    exclusiveMaximum: true,
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'NumberType' });

        const expectedString = `export interface NumberType {
    price: number; // format: "decimal"; maximum: 100; exclusiveMinimum: true; exclusiveMaximum: true
}
`;
        expect(result).toEqual(expectedString);
    });

    it('convert mixed number type props', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            required: ['serviceType', 'price'],
            properties: {
                price: {
                    type: 'number',
                    minimum: 0,
                    exclusiveMinimum: true,
                    exclusiveMaximum: true,
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'NumberType' });

        const expectedString = `export interface NumberType {
    price: number; // exclusiveMinimum: true; exclusiveMaximum: true
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should convert format', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            properties: {
                password: {
                    type: 'string',
                    format: 'password',
                    maxLength: 255,
                    minLength: 1,
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'Format' });

        const expectedString = `export interface Format {
    password: string; // format: "password"; minLength: 1; maxLength: 255
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert json object -> AssetDto', async () => {
        const swaggerJson = {
            additionalProperties: false,
            description: 'DESCRIPTION',
            properties: {
                id: { format: 'guid', type: 'string' },
                name: { nullable: true, type: 'string' },
                type: { $ref: '#/components/schemas/AssetType' },
                files: { items: { $ref: '#/components/schemas/AssetFileDto' }, nullable: true, type: 'array' },
            },
            type: 'object',
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'AssetDto' });

        const expectedString = `/**
 * DESCRIPTION 
 */
export interface AssetDto {
    id: string; // format: "guid"
    name?: string;
    type: AssetType;
    files?: AssetFileDto[];
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert json object -> ServiceTypeDto', async () => {
        const swaggerJson = {
            allOf: [
                {
                    $ref: '#/components/schemas/ServiceTypeBasicDto',
                },
                {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        description: {
                            type: 'string',
                            nullable: true,
                        },
                        turnAroundDays: {
                            type: 'integer',
                            nullable: true,
                        },
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
                        lowestPrice: {
                            type: 'number',
                            format: 'decimal',
                            nullable: true,
                        },
                        isConfigured: {
                            type: 'boolean',
                            nullable: true,
                        },
                    },
                },
            ],
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'ServiceTypeDto' });

        const expectedString = `export interface ServiceTypeDto extends ServiceTypeBasicDto {
    description?: string;
    turnAroundDays?: number;
    serviceCategory?: ServiceCategoryDto;
    priceRanges?: ServiceTypePriceRangeDto[];
    lowestPrice?: number; // format: "decimal"
    isConfigured?: boolean;
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert interface extensions', async () => {
        const swaggerJson = {
            allOf: [
                {
                    $ref: '#/components/schemas/One',
                },
                {
                    $ref: '#/components/schemas/Two',
                },
                {
                    $ref: '#/components/schemas/Three',
                },
                {
                    type: 'object',
                    additionalProperties: false,
                },
            ],
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'CustomType' });

        const expectedString = `export interface CustomType extends One, Two, Three {
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert PatchBriefDto', async () => {
        const swaggerJson = {
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

        const result = parseObject({
            schema: swaggerJson,
            schemaKey: 'PatchBriefDto',
        });

        const expectedTypesString = `export interface PatchBriefDto {
    requestedDelivery?: string; // format: "date-time"
    tiers?: PriceTier[];
}
`;
        expect(result).toEqual(expectedTypesString);
    });

    it('should properly convert json object -> ServiceTypePriceRangeDto', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            properties: {
                priceTier: {
                    $ref: '#/components/schemas/PriceTier',
                },
                lowerBound: {
                    type: 'number',
                    format: 'float',
                },
                upperBound: {
                    type: 'number',
                    format: 'decimal',
                    nullable: true,
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'ServiceTypePriceRangeDto' });

        const expectedString = `export interface ServiceTypePriceRangeDto {
    priceTier: PriceTier;
    lowerBound: number; // format: "float"
    upperBound?: number; // format: "decimal"
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert json object -> PageOfAssetDto', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            properties: {
                data: {
                    type: 'array',
                    nullable: true,
                    items: {
                        $ref: '#/components/schemas/AssetDto',
                    },
                },
                next: {
                    nullable: true,
                    oneOf: [
                        {
                            $ref: '#/components/schemas/NextPage',
                        },
                    ],
                },
                meta: {
                    nullable: true,
                    oneOf: [
                        {
                            $ref: '#/components/schemas/MetaPage',
                        },
                    ],
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'PageOfAssetDto' });

        const expectedString = `export interface PageOfAssetDto {
    data?: AssetDto[];
    next?: NextPage;
    meta?: MetaPage;
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert json object -> CreateBriefDto', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'description', 'briefType'],
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

        const result = parseObject({ schema: swaggerJson, schemaKey: 'CreateBriefDto' });

        const expectedString = `export interface CreateBriefDto {
    title: string; // minLength: 1; maxLength: 255
    description: string; // minLength: 1; maxLength: 4000
    briefType: BriefType;
    inspirationalLinks?: string[]; // maxItems: 5
    serviceType?: ServiceTypeBasicDto;
    providerServiceId?: string; // format: "guid"
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert json object -> AssetFileDto', async () => {
        const swaggerJson = {
            type: 'object',
            additionalProperties: false,
            properties: {
                state: {
                    $ref: '#/components/schemas/FileState',
                },
                kind: {
                    $ref: '#/components/schemas/FileKind',
                },
                creationTime: {
                    type: 'string',
                    format: 'date-time',
                },
                contentType: {
                    type: 'string',
                    nullable: true,
                },
                hash: {
                    type: 'string',
                    nullable: true,
                },
                location: {
                    type: 'string',
                    nullable: true,
                },
                sizeBytes: {
                    type: 'integer',
                    format: 'int64',
                },
                duration: {
                    type: 'number',
                    format: 'double',
                    nullable: true,
                },
                url: {
                    type: 'string',
                    nullable: true,
                },
            },
        };

        const result = parseObject({ schema: swaggerJson, schemaKey: 'AssetFileDto' });

        const expectedString = `export interface AssetFileDto {
    state: FileState;
    kind: FileKind;
    creationTime: string; // format: "date-time"
    contentType?: string;
    hash?: string;
    location?: string;
    sizeBytes: number; // format: "int64"
    duration?: number; // format: "double"
    url?: string;
}
`;
        expect(result).toEqual(expectedString);
    });

    it('should properly convert enum -> AssetType', async () => {
        const swaggerJson = {
            type: 'string',
            description: '',
            'x-enumNames': ['Audio', 'Video', 'Image', 'Youtube'],
            enum: ['Audio', 'Video', 'Image', 'Youtube'],
        };

        const result = parseEnum({ schema: swaggerJson, schemaKey: 'AssetType' });

        const expectedString = `export type AssetType = 'Audio' | 'Video' | 'Image' | 'Youtube';\n`;

        expect(result).toEqual(expectedString);
    });

    it('should properly combine in one file', async () => {
        const example = {
            components: {
                schemas: {
                    AssetDto: {
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
                    },
                    AssetType: {
                        type: 'string',
                        description: '',
                        'x-enumNames': ['Audio', 'Video', 'Image'],
                        enum: ['Audio', 'Video', 'Image'],
                    },
                    AssetFileDto: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            state: {
                                $ref: '#/components/schemas/FileState',
                            },
                            kind: {
                                $ref: '#/components/schemas/FileKind',
                            },
                            creationTime: {
                                type: 'string',
                                format: 'date-time',
                            },
                            contentType: {
                                type: 'string',
                                nullable: true,
                            },
                            hash: {
                                type: 'string',
                                nullable: true,
                            },
                            location: {
                                type: 'string',
                                nullable: true,
                            },
                            sizeBytes: {
                                type: 'integer',
                                format: 'int64',
                            },
                            duration: {
                                type: 'number',
                                format: 'double',
                                nullable: true,
                            },
                            url: {
                                type: 'string',
                                nullable: true,
                            },
                        },
                    },
                    FileState: {
                        type: 'string',
                        description: '',
                        'x-enumNames': ['Created', 'Uploading', 'Processing', 'Failed', 'Available', 'Deleted'],
                        enum: ['Created', 'Uploading', 'Processing', 'Failed', 'Available', 'Deleted'],
                    },
                    FileKind: {
                        type: 'string',
                        description: '',
                        'x-enumNames': ['Original', 'Stream', 'Waveform'],
                        enum: ['Original', 'Stream', 'Waveform'],
                    },
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = `export interface AssetDto {
    id: string; // format: "guid"
    name?: string;
    type: AssetType;
    files?: AssetFileDto[];
}
export type AssetType = 'Audio' | 'Video' | 'Image';
export interface AssetFileDto {
    state: FileState;
    kind: FileKind;
    creationTime: string; // format: "date-time"
    contentType?: string;
    hash?: string;
    location?: string;
    sizeBytes: number; // format: "int64"
    duration?: number; // format: "double"
    url?: string;
}
export type FileState = 'Created' | 'Uploading' | 'Processing' | 'Failed' | 'Available' | 'Deleted';
export type FileKind = 'Original' | 'Stream' | 'Waveform';
 
`;
        expect(resultString).toEqual(expectedString);
    });

    it('should return TODO text if data type is wrong (catch block)', async () => {
        const example = {
            components: {
                schemas: {
                    FileState: {
                        type: 'string',
                        description: '',
                        $ref: { wrongData: 'wrongData' },
                    },
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = '// TODO: ERROR! Something wrong with FileState \n \n';

        expect(resultString).toEqual(expectedString);
    });

    it('should return TODO text if type was not converted', async () => {
        const example = {
            components: {
                schemas: {
                    AssetDto: {
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
                        },
                    },
                    WrongData: {
                        type: 'foo',
                    },
                    AssetFileDto: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            creationTime: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = `export interface AssetDto {
    id: string; // format: "guid"
    name?: string;
}
// TODO: ERROR! Something wrong with WrongData 
export interface AssetFileDto {
    creationTime: string; // format: "date-time"
}
 
`;
        expect(resultString).toEqual(expectedString);
    });

    it('should return correct type for array of integers', async () => {
        const example = {
            components: {
                schemas: {
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
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = `export interface ArrayOfIntegers {
    invoiceNumbers?: number[];
}
 
`;
        expect(resultString).toEqual(expectedString);
    });

    it('should return "any" type for property without a type', async () => {
        const example = {
            components: {
                schemas: {
                    Notification: {
                        type: 'object',
                        additionalProperties: false,
                        properties: {
                            payload: {
                                nullable: true,
                            },
                        },
                    },
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = `export interface Notification {
    payload?: any;
}
 
`;
        expect(resultString).toEqual(expectedString);
    });

    it('should return type for a "dictionary"', async () => {
        const example = {
            components: {
                schemas: {
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
                },
            },
        };

        const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

        const expectedString = `export type BillingProviderKind = 'Legacy' | 'Fusebill';
export type ServiceOfferKind = 'MasteringAndDistribution' | 'Video' | 'Samples' | 'Mastering' | 'Distribution';
export interface UserMetadata {
    serviceOffers: {
[key in ServiceOfferKind]: BillingProviderKind; 
 }; 
    copy: {
[key in ServiceOfferKind]: BillingProviderKind; 
 }; 
}
 
`;
        expect(resultString).toEqual(expectedString);
    });
});

it('should return type for a multiple "dictionary" types', async () => {
    const example = {
        components: {
            schemas: {
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
            },
        },
    };

    const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

    const expectedString = `export type BillingProviderKind = 'Legacy' | 'Fusebill';
export type ServiceOfferKind = 'MasteringAndDistribution' | 'Video' | 'Samples' | 'Mastering' | 'Distribution';
export interface UserSubscriptions {
    current: {
[key in ServiceOfferKind]: CurrentSubscription; 
 }; 
    next: {
[key in ServiceOfferKind]: NextSubscription; 
 }; 
}
 
`;
    expect(resultString).toEqual(expectedString);
});

it('should return type for a "dictionary" type boolean', async () => {
    const example = {
        components: {
            schemas: {
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
                        type: {
                            $ref: '#/components/schemas/CollectionType',
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
            },
        },
    };

    const resultString = parseSchemas({ json: example, swaggerVersion: 3 });

    const expectedString = `export interface ContentDtoOfCollectionDto {
    data?: CollectionDto[];
    paging?: PagingOptionsDto;
}
export interface CollectionDto {
    id: string; // format: "guid"
    ownerId: string; // format: "guid"
    name?: string;
    type: CollectionType;
    creationTime: string; // format: "date-time"
    lastModifiedTime: string; // format: "date-time"
    isSoftDeleted: boolean;
    collaborators?: CollaboratorDto[];
    permissions: {
[key in UserOperation]: boolean; 
 }; 
}
export type UserOperation = 'Read' | 'Write';
 
`;
    expect(resultString).toEqual(expectedString);
});

it('should return overrided enum schema', async () => {

    // What will be fetched from Swagger Json
    const example = {
        components: {
            schemas: {
                ServiceOfferKind: {
                    type: 'string',
                    description: '',
                    'x-enumNames': [
                        'MasteringAndDistribution',
                        'Video',
                        'Samples',
                        'Mastering',
                        'Distribution',
                        'Sessions',
                    ],
                    enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
                },
            },
        },
    };

    const resultString = parseSchemas({
        json: example,
        swaggerVersion: 3,
        // Overrided value "ServiceOfferKind" enum
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

    const expectedString = `/**
 * Warning! This type is overrided 
 */
export type ServiceOfferKind = 'masteringAndDistribution' | 'video' | 'samples' | 'mastering' | 'distribution' | 'sessions';
 
`;
    expect(resultString).toEqual(expectedString);
});

it('should return description', async () => {
    const example = {
        components: {
            schemas: {
                PlanFrequencyIdentifier: {
                    type: 'object',
                    description: 'PlanFrequencyIdentifier description',
                    additionalProperties: false,
                    properties: {
                        code: {
                            type: 'string',
                            description: 'The Fusebill plan code.',
                            nullable: true,
                        },
                        currentQuantity: {
                            type: 'number',
                            description: 'The current quantity of the product within the subscription.',
                            format: 'decimal',
                        },
                        numberOfCredits: {
                            type: 'integer',
                            description: 'The number of credits associated to this subscription product.',
                            format: 'int32',
                            nullable: true,
                        },
                        frequency: {
                            description: 'The interval of the plan (monthly/yearly).',
                            oneOf: [
                                {
                                    $ref: '#/components/schemas/Interval',
                                },
                            ],
                        },
                        hasOverduePayment: {
                            type: 'object',
                            description: 'Says if the user has overdue payments by service offer.',
                            nullable: true,
                            'x-dictionaryKey': {
                                $ref: '#/components/schemas/ServiceOfferKind',
                            },
                            additionalProperties: {
                                type: 'boolean',
                            },
                        },
                        userIds: {
                            type: 'array',
                            description: 'The user IDs.',
                            items: {
                                type: 'string',
                                format: 'guid',
                            },
                        },
                        isDefault: {
                            type: 'boolean',
                            description: 'Boolean description',
                        },
                    },
                },
            },
        },
    };

    const resultString = parseSchemas({
        json: example,
        swaggerVersion: 3,
    });

    const expectedString = `/**
 * PlanFrequencyIdentifier description 
 */
export interface PlanFrequencyIdentifier {
/**
 * The Fusebill plan code. 
 */
    code?: string;
/**
 * The current quantity of the product within the subscription. 
 */
    currentQuantity: number; // format: "decimal"
/**
 * The number of credits associated to this subscription product. 
 */
    numberOfCredits?: number; // format: "int32"
/**
 * The interval of the plan (monthly/yearly). 
 */
    frequency: Interval;
/**
 * Says if the user has overdue payments by service offer. 
 */
    hasOverduePayment: {
[key in ServiceOfferKind]: boolean; 
 }; 
/**
 * The user IDs. 
 */
    userIds: string[];
/**
 * Boolean description 
 */
    isDefault: boolean;
}
 
`;
    expect(resultString).toEqual(expectedString);
});
