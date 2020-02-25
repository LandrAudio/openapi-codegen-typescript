# OpenApi-codegen-typescript

## Installation

yarn
`yarn add -D openapi-codegen-typescript`
npm
`npm install openapi-codegen-typescript --save-dev`

## Description
What is this library for?

  - For fetching json file (mostly for "Swagger json")
  #### Example:
  ```javascript
  const { fetchSwaggerJsonFile } = require('openapi-codegen-typescript');  
  
  async function doSomething() {
      const json = await fetchSwaggerJsonFile('https://custom/swagger.json');
      console.log("Json Result", json)
  }
  ```
  - For converting swagger.json file to typescript types
  #### Example:
  ```javascript
    const { fetchSwaggerJsonFile, convertToTypes } = require('openapi-codegen-typescript');  
    
    async function doSomething() {
        const json = await fetchSwaggerJsonFile('https://custom/swagger.json');
        convertToTypes({ json, fileName: 'dtoAPI', folderPath: 'src/types/generated', swaggerVersion: 2 });
    }
  ```

This function ('doSomething()') fetches json file from urls, then converts json 
to typescript "types" and writes "types" to file ('src/types/generated/dtoAPI')
If "swaggerVersion" will not be provided - it will be set to "1" by default.
    
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
                  swaggerVersion: 2,
              });
      }
  ```
This function ('doSomething()') fetches json file from urls, then converts json 
to "mocks" and writes "mocks" to file ('src/mocks/generated/dtoAPI') with imports from typescript types ('src/types/generated/dtoAPI')
If "swaggerVersion" will not be provided - it will be set to "1" by default.

## AllInOne Example:

```javascript
const { fetchSwaggerJsonFile, convertToTypes, convertToMocks } = require('openapi-codegen-typescript');

const petShopLink = 'https://petstore.swagger.io/v2/swagger.json';

async function main() {
    const json = await fetchSwaggerJsonFile(petShopLink);
    convertToTypes({ json, fileName: 'typesAPI', folderPath: 'src/types/generated', swaggerVersion: 2 });
    convertToMocks({
        json,
        fileName: 'mocksAPI',
        folderPath: 'src/mocks/generated',
        typesPath: '../../types/generated/typesAPI',
        swaggerVersion: 2,
    });
}

main();
```

## Methods:

#### fetchSwaggerJsonFile(url)
`url`: `string` - url to swagger json file 

Returns a swagger json object;

#### convertToTypes({ json, fileName, folderPath, swaggerVersion })
`json`: `object` - swagger json data;
`fileName`: `string` - name of the file, where typescript types data will be saved;
`folderPath`: `string` - folder path the `fileName`, where typescript types data will be saved;
`swaggerVersion`: `number` - version of the swagger json file (specification). `1` by default;

Returns `void`;

#### convertToMocks({ json, fileName, folderPath, typesPath, swaggerVersion })
`json`: `object` - swagger json data;
`fileName`: `string` - name of the file, where mocks data will be saved;
`folderPath`: `string` - folder path the `fileName`, where mocks data will be saved;
`typesPath`: `string` - folder path to `types`, where typescript types data are saved. 
Path to `types` will be inserted to the type imports in generated mocks (generated -> import {...} from `typesPath`;);
`swaggerVersion`: `number` - version of the swagger json file (specification);

Returns `void`;
