import { GetSchemasProps } from './types';

const fs = require('fs');
const fetch = require('node-fetch');

export const getSchemaProperties = (objectProps: any) =>
    Object.keys(objectProps).map(property => {
        const {
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
        } = objectProps[property];

        return {
            propertyName: property,
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

export const getSchemas = ({ json, swaggerVersion = 1 }: GetSchemasProps) => {
    console.log('json',json);
    if (swaggerVersion === 1) {
        return json?.components?.schemas;
    } else if (swaggerVersion === 2) {
        return json.definitions;
    } else {
        return undefined;
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
