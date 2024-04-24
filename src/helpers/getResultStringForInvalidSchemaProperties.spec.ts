import { getResultStringForInvalidSchemaProperties } from './getResultStringForInvalidSchemaProperties';

it(`should return expected string with errorMessage`, () => {
    const expected = `// Error: error message mocked for property: propertyName mocked\n\tpropertyName mocked: any;\n`;
    const result = getResultStringForInvalidSchemaProperties({
        propertyName: 'propertyName mocked',
        errorMessage: 'error message mocked',
    });

    expect(result).toBe(expected);
});
