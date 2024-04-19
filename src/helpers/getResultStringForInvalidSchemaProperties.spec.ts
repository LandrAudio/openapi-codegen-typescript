import { getResultStringForInvalidSchemaProperties } from './getResultStringForInvalidSchemaProperties';

it(`should return expected string with errorMessage`, () => {
    const expected = '"// Error: error message mocked"';
    const result = getResultStringForInvalidSchemaProperties('error message mocked');

    expect(result).toBe(expected);
});
