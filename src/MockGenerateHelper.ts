import casual from 'casual';
import indefinite from 'indefinite';
import { hashedString } from './shared';
import {
    ConvertRefType,
    DataTypes,
    EnumProps,
    EnumSchema,
    GetArrayOfItemsMockProps,
    GetArrayOfOneOfMockProps,
    GetDictionaryMockProps,
    GetNumberMockProps,
    GetRefTypeMockProps,
    GetStringMockProps,
    MockArrayProps,
    PropertyNames,
    StringFormats,
    SwaggerProps,
} from './types';
import { parseEnum } from './typesConverter';

export class MockGenerateHelper {
    private casual: Casual.Generators & Casual.Casual;

    constructor(casual: Casual.Generators & Casual.Casual) {
        this.casual = casual;
    }

    getStringMock({ name, propertyName, format }: GetStringMockProps): MockArrayProps {
        this.casual.seed(hashedString(name + propertyName));
        let value;

        if (!format) {
            // simple string
            value = `'${propertyName}-${name.toLowerCase()}'`;
        } else if (format === StringFormats.Guid || propertyName === PropertyNames.Id) {
            value = `'${this.casual.uuid}'`;
        } else if (format === StringFormats.DateTime || format === StringFormats.TimeSpan) {
            value = `'2019-06-10T06:20:01.389Z'`;
        } else if (format === StringFormats.Date) {
            value = `'2019-06-10'`;
        } else if (format === StringFormats.Email) {
            value = `'${this.casual.email}'`;
        } else if (format === StringFormats.Uri) {
            value = `'${this.casual.url}'`;
        }

        if (!value) {
            value = 'TODO: FIX';
        }

        return {
            propertyName,
            value,
        };
    }

    /**
     * Returns mock data for types 'integer' and 'double'
     * @param propertyName
     * @param type
     * @param minimum
     * @param maximum
     */
    getNumberMock({ propertyName, type, minimum, maximum }: GetNumberMockProps): MockArrayProps {
        return {
            propertyName,
            value:
                type === DataTypes.Integer
                    ? casual.integer(minimum || 0, maximum || 30)
                    : casual.double(minimum || 0, maximum || 30),
        };
    }

    /**
     * Returns mock data for type 'boolean'
     * @param propertyName
     */
    getBooleanMock(propertyName: string): MockArrayProps {
        return {
            propertyName,
            value: true,
        };
    }

    /**
     * Returns mock data for array of values.
     * Could return array of DTOs, Enums, Strings, Doubles...
     * @param propertyName
     * @param items
     * @param DTOs
     */
    getArrayOfItemsMock({ propertyName, items, DTOs }: GetArrayOfItemsMockProps): MockArrayProps {
        let result = {
            propertyName: `TODO: FIX ERROR in ${propertyName}`,
            value: 'NULL',
        } as MockArrayProps;

        if (items[SwaggerProps.$ref]) {
            const refType = items[SwaggerProps.$ref].split('/');

            const ref = MockGenerateHelper.parseRefType(refType);

            const schema = DTOs[ref];
            if (schema && schema.enum) {
                result = { propertyName, value: `['${schema.enum[0]}']` };
            } else {
                result = MockGenerateHelper.convertRefType({ propertyName, ref, isArray: true });
            }
        } else {
            const type = items.oneOf
                ? MockGenerateHelper.parseRefType(items.oneOf[0][SwaggerProps.$ref].split('/'))
                : items.type;

            if (items.oneOf) {
                const schema = DTOs[type];
                if (schema && schema.enum) {
                    result = { propertyName, value: `['${schema.enum[0]}']` };
                }
            } else {
                if (items.type === DataTypes.Number) {
                    result = { propertyName, value: `[${casual.double()},${casual.double()}]` };
                } else if (items.type === DataTypes.Integer) {
                    result = { propertyName, value: `[${casual.integer()},${casual.integer()}]` };
                } else {
                    result = { propertyName, value: `['${casual.word}']` };
                }
            }
        }

        return result;
    }

    /**
     * Return one element of Enum or DTO
     * @param propertyName
     * @param oneOf
     * @param DTOs
     * @param overrideSchemas
     */
    getDtoMock({ propertyName, oneOf, DTOs, overrideSchemas }: GetArrayOfOneOfMockProps): MockArrayProps {
        const refType = oneOf[0][SwaggerProps.$ref].split('/');

        const schemaName = MockGenerateHelper.parseRefType(refType);

        const schema = MockGenerateHelper.getOverridedSchema(schemaName, overrideSchemas) || DTOs[schemaName];

        if (schema && schema.enum) {
            return { propertyName, value: `'${schema.enum[0]}'` };
        } else {
            return MockGenerateHelper.convertRefType({ propertyName, ref: schemaName });
        }
    }

    static getDictionaryResultValue({
        enumValues,
        value,
    }: {
        enumValues: Array<string>;
        value: string | Function;
    }): string {
        let result = `{ `;
        enumValues.forEach((el: string) => {
            result += `\n"${el}": ${typeof value === 'function' ? value() : value},`;
        });
        result += `\n}`;

        return result;
    }

    getDictionaryMock({
        propertyName,
        xDictionaryKey,
        additionalProperties,
        DTOs,
        overrideSchemas,
    }: GetDictionaryMockProps): MockArrayProps {
        if (!xDictionaryKey[SwaggerProps.$ref]) {
            return { propertyName, value: ' // TODO: Wrong dictionary type' };
        }

        const dictionaryRef = MockGenerateHelper.parseRefType(xDictionaryKey[SwaggerProps.$ref].split('/'));

        let dicSchema;

        /**
         * Check if current schema is override
         */
        if (overrideSchemas?.length && overrideSchemas.find(e => e[dictionaryRef])) {
            // for TS happiness
            const overrideSchema = overrideSchemas.find(e => e[dictionaryRef]);
            if (overrideSchema) {
                dicSchema = overrideSchema[dictionaryRef];
            }
        } else {
            dicSchema = DTOs[dictionaryRef];
        }

        if (dicSchema && dicSchema.enum) {
            let result: string | Function | undefined = undefined;

            // Enum key with Object values or Enum Values
            if (additionalProperties[SwaggerProps.$ref]) {
                const additionalRef = MockGenerateHelper.parseRefType(
                    additionalProperties[SwaggerProps.$ref].split('/'),
                );

                const aOrAn = indefinite(additionalRef, { articleOnly: true });

                const additionalSchema = DTOs[additionalRef];

                // Enum value
                if (additionalSchema && additionalSchema.enum) {
                    result = `"${additionalSchema.enum[0]}"`;
                } else {
                    // Object value
                    result = `${aOrAn}${additionalRef}API()`;
                }
            }

            // Enum keys and simple types
            if (additionalProperties.type) {
                switch (additionalProperties.type) {
                    case DataTypes.Integer:
                        result = () => casual.integer(0, 100);
                        break;
                    case DataTypes.Number:
                        result = () => casual.double(0, 100);
                        break;
                    case DataTypes.String:
                        result = () => casual.string;
                        break;
                    case DataTypes.Boolean:
                        result = 'true';
                        break;
                    default: {
                        result = ' // TODO: Wrong dictionary value';
                        break;
                    }
                }
            }

            return {
                propertyName,
                value: MockGenerateHelper.getDictionaryResultValue({
                    enumValues: dicSchema.enum,
                    value: result || `" // TODO: Wrong dictionary value"`,
                }),
            };
        }

        return { propertyName, value: `" // TODO: Wrong dictionary value",` };
    }

    getAnyMock({ propertyName }: { propertyName: string }): MockArrayProps {
        return {
            propertyName,
            value: `'${propertyName.toLowerCase()}'`,
        };
    }

    getRefTypeMock = ({ $ref, propertyName, DTOs, overrideSchemas }: GetRefTypeMockProps): MockArrayProps => {
        let result = {
            propertyName: `TODO: FIX ERROR in ${propertyName} ref:${$ref}`,
            value: 'NULL',
        } as MockArrayProps;

        const refType = $ref.split('/');

        const schemaName = MockGenerateHelper.parseRefType(refType);

        let schema = MockGenerateHelper.getOverridedSchema(schemaName, overrideSchemas) || DTOs[schemaName];

        if (schema && schema.enum) {
            result = { propertyName, value: `'${schema.enum[0]}'` };
        } else if (schema) {
            result = MockGenerateHelper.convertRefType({ propertyName, ref: schemaName });
        }

        return result;
    };

    static parseRefType = (refType: string[]): string => refType[refType.length - 1];

    static getOverridedSchema = (schemaName: string, overrideSchemas?: Array<EnumSchema>): EnumProps | undefined => {
        if (overrideSchemas?.length && overrideSchemas.find(e => e[schemaName])) {
            // for TS happiness
            const overrideSchema = overrideSchemas.find(e => e[schemaName]);
            if (overrideSchema) {
                return overrideSchema[schemaName];
            }
        }
    };

    static joinVariableNamesAndValues = (varNamesAndValues: Array<MockArrayProps>): string =>
        varNamesAndValues.map((mock: MockArrayProps) => `  ${mock.propertyName}: ${mock.value},`).join('\n');

    static getMockTemplateString = ({ typeName, varNamesAndValues }: any) => {
        const prefix = indefinite(typeName, { articleOnly: true });
        const joinedVarsAndNames = MockGenerateHelper.joinVariableNamesAndValues(varNamesAndValues);
        return `
export const ${prefix}${typeName}API = (overrides?: Partial<${typeName}>): ${typeName} => {
  return {
  ${joinedVarsAndNames}
  ...overrides,
  };
};
`;
    };

    static convertRefType = ({
        propertyName,
        ref,
        isArray = false,
    }: ConvertRefType): {
        propertyName: string;
        value: any;
    } => {
        const aOrAn = indefinite(ref, { articleOnly: true });

        let value;
        if (isArray) {
            value = `overrides?.${propertyName} || [${aOrAn}${ref}API()]`;
        } else {
            value = `overrides?.${propertyName} || ${aOrAn}${ref}API()`;
        }

        return {
            propertyName,
            value,
        };
    };
}
