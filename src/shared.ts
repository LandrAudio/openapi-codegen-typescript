import { GetSchemasProps } from './types';

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

export const getSchemas = ({ json, swaggerVersion = 3 }: GetSchemasProps) => {
    switch (swaggerVersion) {
        case 3:
            return json?.components?.schemas;
        case 2:
            return json?.definitions;
        default:
            return json?.components?.schemas;
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
