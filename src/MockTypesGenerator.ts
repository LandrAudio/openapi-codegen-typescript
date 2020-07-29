import casual from 'casual';
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

export class MockTypesGenerator {
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

    getNumberMock({ propertyName, type, minimum, maximum }: GetNumberMockProps): MockArrayProps {
        return {
            propertyName,
            value:
                type === DataTypes.Integer
                    ? casual.integer(minimum || 0, maximum || 30)
                    : casual.double(minimum || 0, maximum || 30),
        };
    }

    getBooleanMock(propertyName: string): MockArrayProps {
        return {
            propertyName,
            value: true,
        };
    }

    getArrayOfItemsMock({ propertyName, items, DTOs, parseRefType }: GetArrayOfItemsMockProps): MockArrayProps {
        let result = {
            propertyName: `TODO: FIX ERROR in ${propertyName}`,
            value: 'NULL',
        } as MockArrayProps;

        if (items[SwaggerProps.$ref]) {
            const refType = items[SwaggerProps.$ref].split('/');

            const ref = parseRefType(refType);

            const schema = DTOs[ref];
            if (schema && schema.enum) {
                result = { propertyName, value: `['${schema.enum[0]}']` };
            } else {
                result = MockTypesGenerator.convertRefType({ propertyName, ref, isArray: true });
            }
        } else {
            const type = items.oneOf ? parseRefType(items.oneOf[0][SwaggerProps.$ref].split('/')) : items.type;

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

    getArrayOfOneOfMock({ propertyName, oneOf, DTOs, parseRefType }: GetArrayOfOneOfMockProps): MockArrayProps {
        const refType = oneOf[0][SwaggerProps.$ref].split('/');

        const ref = parseRefType(refType);

        const schema = DTOs[ref];
        if (schema && schema.enum) {
            return { propertyName, value: `'${schema.enum[0]}'` };
        } else {
            return MockTypesGenerator.convertRefType({ propertyName, ref });
        }
    }

    getRefTypeMock = ({ $ref, propertyName, DTOs, parseRefType }: GetRefTypeMockProps): MockArrayProps => {
        let result = {
            propertyName: `TODO: FIX ERROR in ${propertyName} ref:${$ref}`,
            value: 'NULL',
        } as MockArrayProps;

        const refType = $ref.split('/');

        const ref = parseRefType(refType);

        const schema = DTOs[ref];
        if (schema && schema.enum) {
            result = { propertyName, value: `'${schema.enum[0]}'` };
        } else if (schema) {
            result = MockTypesGenerator.convertRefType({ propertyName, ref });
        }

        return result;
    };

    static getIsAnOrA = (word: string) => {
        const symbol = word[0].toLowerCase();
        const isAn =
            symbol === 'a' || symbol === 'e' || symbol === 'i' || symbol === 'o' || symbol === 'y' || symbol === 'u';

        return isAn ? 'an' : 'a';
    };

    static joinVariableNamesAndValues = (varNamesAndValues: Array<MockArrayProps>): string =>
        varNamesAndValues.map((mock: MockArrayProps) => `  ${mock.propertyName}: ${mock.value},`).join('\n');

    static getMockTemplateString = ({ typeName, varNamesAndValues }: any) => {
        const prefix = MockTypesGenerator.getIsAnOrA(typeName);
        const joinedVarsAndNames = MockTypesGenerator.joinVariableNamesAndValues(varNamesAndValues);
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
        const aOrAn = MockTypesGenerator.getIsAnOrA(ref);

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
