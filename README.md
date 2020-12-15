# OpenApi-codegen-typescript

## Installation

- `yarn add -D openapi-codegen-typescript`
- `npm install openapi-codegen-typescript --save-dev`

## Description

What is this library for?

- For fetching json file (mostly for "Swagger json")

#### Example:

```javascript
const { fetchSwaggerJsonFile } = require('openapi-codegen-typescript');

async function doSomething() {
  const json = await fetchSwaggerJsonFile('https://custom/swagger.json');
  console.log('Json Result', json);
}
```

- For converting swagger.json file to typescript types

#### Example:

```javascript
const { fetchSwaggerJsonFile, convertToTypes } = require('openapi-codegen-typescript');

async function doSomething() {
  const json = await fetchSwaggerJsonFile('https://custom/swagger.json');
  convertToTypes({ json, fileName: 'dtoAPI', folderPath: 'src/types/generated' });
}
```

This function ('doSomething()') fetches json file from urls, then converts json
to typescript "types" and writes "types" to file ('src/types/generated/dtoAPI')

- For generating mock files that are using converted types

#### Example:

```javascript
const { fetchSwaggerJsonFile, convertToTypes } = require('openapi-codegen-typescript');

async function doSomething() {
  const json = await fetchSwaggerJsonFile('https://custom/swagger.json');
  convertToMocks({
    json,
    fileName: 'dtoAPI',
    folderPath: 'src/mocks/generated',
    typesPath: '../../types/generated/dtoAPI',
  });
}
```

This function ('doSomething()') fetches json file from urls, then converts json to "mocks" and writes "mocks" to file
('src/mocks/generated/dtoAPI') with imports from typescript types ('src/types/generated/dtoAPI')

## Overriding enum schema type

You can override open-api enum types and mocks by specifying `overrideSchemas` prop.

Let's imagine that we have this schema enum type in a json file:

```json
{
  "SomeType": {
    "type": "string",
    "description": "",
    "x-enumNames": ["Audio", "Video", "Image", "Text", "Raw"],
    "enum": ["Audio", "Video", "Image", "Text", "Raw"]
  }
}
```

Overriding example:

```javascript
const { fetchSwaggerJsonFile, convertToTypes, convertToMocks } = require('openapi-codegen-typescript');

const url = 'https://someLinkToSwagger/v2/swagger.json';

async function main() {
  const json = await fetchSwaggerJsonFile(url);
  const overrideSchemas = [
    {
      ServiceOfferKind: {
        type: 'string',
        description: 'Warning! This type is overrided',
        enum: ['masteringAndDistribution', 'video', 'samples', 'mastering', 'distribution', 'sessions'],
      },
    },
  ];

  convertToTypes({
    json,
    fileName: 'typesAPI',
    folderPath: 'src/types/generated',
    overrideSchemas,
  });
  convertToMocks({
    json,
    fileName: 'mocksAPI',
    folderPath: 'src/mocks/generated',
    typesPath: '../../types/generated/typesAPI',
    overrideSchemas,
  });
}

main();
```

## AllInOne Example:

```javascript
const { fetchSwaggerJsonFile, convertToTypes, convertToMocks } = require('openapi-codegen-typescript');

const petShopLink = 'https://petstore.swagger.io/v2/swagger.json';

async function main() {
  const json = await fetchSwaggerJsonFile(petShopLink);
  convertToTypes({ json, fileName: 'typesAPI', folderPath: 'src/types/generated' });
  convertToMocks({
    json,
    fileName: 'mocksAPI',
    folderPath: 'src/mocks/generated',
    typesPath: '../../types/generated/typesAPI',
  });
}

main();
```

## Methods:

#### fetchSwaggerJsonFile(url)

`url`: `string` - url to swagger json file

Returns a swagger json object;

#### convertToTypes({ json, fileName, folderPath })

`json`: `object` - swagger json data;
`fileName`: `string` - name of the file, where typescript types data will be saved;
`folderPath`: `string` - folder path the `fileName`, where typescript types data will be saved;

Returns `void`;

#### convertToMocks({ json, fileName, folderPath, typesPath })

`json`: `object` - swagger json data;
`fileName`: `string` - name of the file, where mocks data will be saved;
`folderPath`: `string` - folder path the `fileName`, where mocks data will be saved;
`typesPath`: `string` - folder path to `types`, where typescript types data are saved.
Path to `types` will be inserted to the type imports in generated mocks (generated -> import {...} from `typesPath`;);

Returns `void`;
