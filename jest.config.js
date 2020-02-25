module.exports = {
    clearMocks: true,
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
};
