import { parseEnum } from '../src/helpers/parseEnum';
import { parseObject } from '../src/helpers/parseObject';
import { parseSchemas } from '../src/typesConverter';
import { aSwaggerV2Mock, aSwaggerV3Mock } from '../src/utils/test-utils';

describe('TS types generation', () => {
    it('should convert id guid property', async () => {
        const schema = {
            type: 'object',
            properties: {
                id: { format: 'guid', type: 'string' },
            },
        };

        const result = parseObject({ schema, schemaKey: 'TypeWithId' });

        const expectedString = `export interface TypeWithId {\n\tid: string; // format: "guid"\n}\n`;
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

        const expectedString = `export interface NumberType {\n\tprice: number; // format: "decimal"; maximum: 100; exclusiveMinimum: true; exclusiveMaximum: true\n}\n`;

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

        const expectedString = `export interface NumberType {\n\tprice: number; // exclusiveMinimum: true; exclusiveMaximum: true\n}\n`;

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

        const expectedString = `export interface Format {\n\tpassword: string; // format: "password"; minLength: 1; maxLength: 255\n}\n`;

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

        const expectedString = `/**\n * DESCRIPTION\n */
export interface AssetDto {
\tid: string; // format: "guid"
\tname?: string;
\ttype: AssetType;
\tfiles?: AssetFileDto[];
}\n`;

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
\tdescription?: string;
\tturnAroundDays?: number;
\tserviceCategory?: ServiceCategoryDto;
\tpriceRanges?: ServiceTypePriceRangeDto[];
\tlowestPrice?: number; // format: "decimal"
\tisConfigured?: boolean;
}\n`;

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

        const expectedString = `export interface CustomType extends One, Two, Three {\n}\n`;

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
\trequestedDelivery?: string; // format: "date-time"
\ttiers?: PriceTier[];
}\n`;

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
\tpriceTier: PriceTier;
\tlowerBound: number; // format: "float"
\tupperBound?: number; // format: "decimal"
}\n`;

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
\tdata?: AssetDto[];
\tnext?: NextPage;
\tmeta?: MetaPage;
}\n`;

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
\ttitle: string; // minLength: 1; maxLength: 255
\tdescription: string; // minLength: 1; maxLength: 4000
\tbriefType: BriefType;
\tinspirationalLinks?: string[]; // maxItems: 5
\tserviceType?: ServiceTypeBasicDto;
\tproviderServiceId?: string; // format: "guid"
}\n`;

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
\tstate: FileState;
\tkind: FileKind;
\tcreationTime: string; // format: "date-time"
\tcontentType?: string;
\thash?: string;
\tlocation?: string;
\tsizeBytes: number; // format: "int64"
\tduration?: number; // format: "double"
\turl?: string;
}\n`;

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
        const json = aSwaggerV3Mock({
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
        });

        const resultString = parseSchemas({ json });

        const expectedString = `export interface AssetDto {
\tid: string; // format: "guid"
\tname?: string;
\ttype: AssetType;
\tfiles?: AssetFileDto[];
}
export type AssetType = 'Audio' | 'Video' | 'Image';
export interface AssetFileDto {
\tstate: FileState;
\tkind: FileKind;
\tcreationTime: string; // format: "date-time"
\tcontentType?: string;
\thash?: string;
\tlocation?: string;
\tsizeBytes: number; // format: "int64"
\tduration?: number; // format: "double"
\turl?: string;
}
export type FileState = 'Created' | 'Uploading' | 'Processing' | 'Failed' | 'Available' | 'Deleted';
export type FileKind = 'Original' | 'Stream' | 'Waveform';\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return Error text if data type is wrong (catch block)', async () => {
        const json = aSwaggerV3Mock({
            FileState: {
                type: 'string',
                description: '',
                $ref: { wrongData: 'wrongData' },
            },
        });

        const resultString = parseSchemas({ json });

        const expectedString = '// Error: Unhandled error with FileState\n\n';

        expect(resultString).toEqual(expectedString);
    });

    it('should return Error text if type was not converted', async () => {
        const json = aSwaggerV3Mock({
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
        });

        const resultString = parseSchemas({ json });

        const expectedString = `export interface AssetDto {\n\tid: string; // format: "guid"\n\tname?: string;\n}
// Error: Unsupported schema for WrongData\nexport interface AssetFileDto {\n\tcreationTime: string; // format: "date-time"\n}\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return correct type for array of integers', async () => {
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

        const resultString = parseSchemas({ json });

        const expectedString = `export interface ArrayOfIntegers {\n\tinvoiceNumbers?: number[];\n}\n\n`;
        expect(resultString).toEqual(expectedString);
    });

    it('should return "any" type for property without a type', async () => {
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

        const resultString = parseSchemas({ json });

        const expectedString = `export interface Notification {\n\tpayload?: any;\n}\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return "any" type items in array for items without a type', async () => {
        const json = aSwaggerV3Mock({
            ArrayOfAny: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    invoiceNumbers: {
                        type: 'array',
                        nullable: true,
                        items: {},
                    },
                },
            },
        });

        const resultString = parseSchemas({ json });

        const expectedString = `export interface ArrayOfAny {\n\tinvoiceNumbers?: any[];\n}\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return type for a "dictionary"', async () => {
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

        const resultString = parseSchemas({ json });

        const expectedString = `export type BillingProviderKind = 'Legacy' | 'Fusebill';
export type ServiceOfferKind = 'MasteringAndDistribution' | 'Video' | 'Samples' | 'Mastering' | 'Distribution';
export interface UserMetadata {
\tserviceOffers: {\n\t[key in ServiceOfferKind]: BillingProviderKind;\n};
\tcopy: {\n\t[key in ServiceOfferKind]: BillingProviderKind;\n};\n}\n\n`;

        expect(resultString).toEqual(expectedString);
    });
});

it('should return type for a multiple "dictionary" types', async () => {
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

    const resultString = parseSchemas({ json });

    const expectedString = `export type BillingProviderKind = 'Legacy' | 'Fusebill';
export type ServiceOfferKind = 'MasteringAndDistribution' | 'Video' | 'Samples' | 'Mastering' | 'Distribution';
export interface UserSubscriptions {
\tcurrent: {\n\t[key in ServiceOfferKind]: CurrentSubscription;\n};
\tnext: {\n\t[key in ServiceOfferKind]: NextSubscription;\n};\n}\n\n`;

    expect(resultString).toEqual(expectedString);
});

it('should return type for a "dictionary" type boolean', async () => {
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
    });

    const resultString = parseSchemas({ json });

    const expectedString = `export interface ContentDtoOfCollectionDto {\n\tdata?: CollectionDto[];\n\tpaging?: PagingOptionsDto;\n}
export interface CollectionDto {
\tid: string; // format: "guid"
\townerId: string; // format: "guid"
\tname?: string;
\ttype: CollectionType;
\tcreationTime: string; // format: "date-time"
\tlastModifiedTime: string; // format: "date-time"
\tisSoftDeleted: boolean;
\tcollaborators?: CollaboratorDto[];
\tpermissions: {\n\t[key in UserOperation]: boolean;\n};\n}
export type UserOperation = 'Read' | 'Write';\n\n`;

    expect(resultString).toEqual(expectedString);
});

it('should return overrided enum schema', async () => {
    // What will be fetched from Swagger Json
    const json = aSwaggerV3Mock({
        ServiceOfferKind: {
            type: 'string',
            description: '',
            'x-enumNames': ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
            enum: ['MasteringAndDistribution', 'Video', 'Samples', 'Mastering', 'Distribution', 'Sessions'],
        },
    });

    const resultString = parseSchemas({
        json,
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

    const expectedString = `/**\n * Warning! This type is overrided\n */
export type ServiceOfferKind = 'masteringAndDistribution' | 'video' | 'samples' | 'mastering' | 'distribution' | 'sessions';\n\n`;

    expect(resultString).toEqual(expectedString);
});

it('should return description', async () => {
    const json = aSwaggerV3Mock({
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
    });

    const resultString = parseSchemas({ json });

    const expectedString = `/**
 * PlanFrequencyIdentifier description
 */
export interface PlanFrequencyIdentifier {
/**
 * The Fusebill plan code.
 */
\tcode?: string;
/**
 * The current quantity of the product within the subscription.
 */
\tcurrentQuantity: number; // format: "decimal"
/**
 * The number of credits associated to this subscription product.
 */
\tnumberOfCredits?: number; // format: "int32"
/**
 * The interval of the plan (monthly/yearly).
 */
\tfrequency: Interval;
/**
 * Says if the user has overdue payments by service offer.
 */
\thasOverduePayment: {\n\t[key in ServiceOfferKind]: boolean;\n};
/**
 * The user IDs.
 */
\tuserIds: string[];
/**
 * Boolean description
 */
\tisDefault: boolean;
}\n\n`;

    expect(resultString).toEqual(expectedString);
});

it('should return CollectionResponseDto', async () => {
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
                paging: {
                    $ref: '#/definitions/PagingDto',
                },
            },
        },
    });

    const resultString = parseSchemas({ json });

    const expectedString = `export interface CollectionResponseDto {\n\tdata: StoredCreditCardDto[];\n\tpaging: PagingDto;\n}\n\n`;

    expect(resultString).toEqual(expectedString);
});

describe('Dictionary types', () => {
    it('should return dictionary value type for integer', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                additionalProperties: false,
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

        const resultString = parseSchemas({ json });

        const expectedString = `export interface GlobalStateCounters {\n\tstates: {\n\t[key in ProductState]: number;\n};\n}\nexport type ProductState = 'Draft' | 'ConfirmDraft';\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return dictionary value type for number', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                additionalProperties: false,
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

        const resultString = parseSchemas({ json });

        const expectedString = `export interface GlobalStateCounters {\n\tstates: {\n\t[key in ProductState]: number;\n};\n}\nexport type ProductState = 'Draft' | 'ConfirmDraft';\n\n`;

        expect(resultString).toEqual(expectedString);
    });

    it('should return dictionary value type for string', async () => {
        const json = aSwaggerV3Mock({
            GlobalStateCounters: {
                type: 'object',
                additionalProperties: false,
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

        const resultString = parseSchemas({ json });

        const expectedString = `export interface GlobalStateCounters {\n\tstates: {\n\t[key in ProductState]: string;\n};\n}\nexport type ProductState = 'Draft' | 'ConfirmDraft';\n\n`;

        expect(resultString).toEqual(expectedString);
    });
});

it('should return type for a "dictionary" type array', async () => {
    const json = aSwaggerV3Mock({
        ComplexDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                name: {
                    type: 'string',
                    nullable: true,
                },
            },
        },
        MainDto: {
            type: 'object',
            additionalProperties: false,
            properties: {
                contributors: {
                    type: 'object',
                    nullable: true,
                    'x-dictionaryKey': {
                        $ref: '#/components/schemas/Role',
                    },
                    additionalProperties: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/ComplexDto',
                        },
                    },
                },
            },
        },
        Role: {
            type: 'string',
            'x-enumNames': ['Role1', 'Role2', 'Role3'],
            enum: ['role1', 'role2', 'role3'],
        },
    });

    const resultString = parseSchemas({ json });

    expect(resultString).toMatchSnapshot();
});
