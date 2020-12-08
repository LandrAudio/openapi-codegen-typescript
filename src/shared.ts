import { GetSchemasProps, SwaggerV2, SwaggerV3 } from './types';

const fs = require('fs');
const fetch = require('node-fetch');

export const getSchemaProperties = (objectProps: any) =>
    Object.keys(objectProps).map(property => {
        const {
            type,
            description,
            $ref,
            oneOf,
            format,
            minLength,
            maxLength,
            nullable,
            items,
            minimum,
            maximum,
            exclusiveMinimum,
            exclusiveMaximum,
            minItems,
            maxItems,
            uniqueItems,
            // Props for "Dictionary" type
            'x-dictionaryKey': xDictionaryKey,
            additionalProperties,
        } = objectProps[property];

        return {
            propertyName: property,
            description,
            type,
            $ref,
            oneOf,
            format,
            minLength,
            maxLength,
            nullable,
            items,
            minimum,
            maximum,
            exclusiveMinimum,
            exclusiveMaximum,
            minItems,
            maxItems,
            uniqueItems,
            xDictionaryKey,
            additionalProperties,
        };
    });

/**
 * Fetches swagger json file by provided url.
 * @param url
 */
export const fetchSwaggerJsonFile = async (url: string) => {
    const fetchedData = await fetch(url);
    return fetchedData.json();
};

export const hashedString = (string: string) => {
    let hash = 0,
        i,
        chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export function isSwaggerV3(json: SwaggerV2 | SwaggerV3): json is SwaggerV3 {
    return Boolean((json as SwaggerV3).openapi?.match(/^3.*/)) && Boolean((json as SwaggerV3).components);
}

export function isSwaggerV2(json: SwaggerV2 | SwaggerV3): json is SwaggerV2 {
    return Boolean((json as SwaggerV2).swagger?.match(/^2.*/)) && Boolean((json as SwaggerV2).definitions);
}

export const getSchemas = ({ json }: GetSchemasProps): any => {
    if (isSwaggerV3(json)) {
        return json?.components?.schemas;
    } else if (isSwaggerV2(json)) {
        return json?.definitions;
    } else {
        throw Error('Schema parse exception. Unsupported version');
    }
};

export const writeToFile = async ({
    folderPath,
    fileName,
    resultString,
}: {
    folderPath: string;
    fileName: string;
    resultString: string;
}) => {
    const isFolderExists = await fs.existsSync(folderPath);
    if (!isFolderExists) {
        await fs.mkdirSync(folderPath);
    }

    await fs.writeFileSync(`${folderPath}/${fileName}.ts`, resultString);
};
