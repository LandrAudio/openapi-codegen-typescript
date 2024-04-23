export const getDescription = (description?: string) => `${description ? `/**\n * ${description} \n */\n` : ''}`;
