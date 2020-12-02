import { SwaggerV2, SwaggerV3 } from '../types';

export const swaggerV3Mock = (schemas: any): SwaggerV3 => {
    return {
        openapi: '3.0.0',
        components: {
            schemas,
        },
    };
};

export const swaggerV2Mock = (definitions: any): SwaggerV2 => {
    return {
        swagger: '2.0',
        definitions,
    };
};
