module.exports = {
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
};
