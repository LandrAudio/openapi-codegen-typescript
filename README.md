# OpenApi-codegen-typescript

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
