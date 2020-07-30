import casual from 'casual';
import indefinite from 'indefinite';
import { hashedString } from './shared';
import {
    ConvertRefType,
    DataTypes,
    GetArrayOfItemsMockProps,
    GetArrayOfOneOfMockProps,
    GetNumberMockProps,
    GetRefTypeMockProps,
    GetStringMockProps,
    MockArrayProps,
    PropertyNames,
    StringFormats,
    SwaggerProps,
} from './types';

export class MockGenerateHelper {
    private casual: any;

    constructor(casual: any) {
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
     */
    getDtoMock({ propertyName, oneOf, DTOs }: GetArrayOfOneOfMockProps): MockArrayProps {
        const refType = oneOf[0][SwaggerProps.$ref].split('/');

        const ref = MockGenerateHelper.parseRefType(refType);

        const schema = DTOs[ref];
        if (schema && schema.enum) {
            return { propertyName, value: `'${schema.enum[0]}'` };
        } else {
            return MockGenerateHelper.convertRefType({ propertyName, ref });
        }
    }

    getRefTypeMock = ({ $ref, propertyName, DTOs }: GetRefTypeMockProps): MockArrayProps => {
        let result = {
            propertyName: `TODO: FIX ERROR in ${propertyName} ref:${$ref}`,
            value: 'NULL',
        } as MockArrayProps;

        const refType = $ref.split('/');

        const ref = MockGenerateHelper.parseRefType(refType);

        const schema = DTOs[ref];
        if (schema && schema.enum) {
            result = { propertyName, value: `'${schema.enum[0]}'` };
        } else if (schema) {
            result = MockGenerateHelper.convertRefType({ propertyName, ref });
        }

        return result;
    };

    static parseRefType = (refType: string[]): string => refType[refType.length - 1];

    static joinVariableNamesAndValues = (varNamesAndValues: Array<MockArrayProps>): string =>
        varNamesAndValues.map((mock: MockArrayProps) => `  ${mock.propertyName}: ${mock.value},`).join('\n');

    static getMockTemplateString = ({ typeName, varNamesAndValues }: any) => {
        const prefix = indefinite(typeName, {articleOnly:true});
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