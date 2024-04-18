import { SchemaProperties } from '../types';

export const getDescription = ({ description }: Pick<SchemaProperties, 'description'>) =>
    `${description ? `/**\n * ${description}\n */\n` : ''}`;
