import 'mutationobserver-shim';
import '@testing-library/jest-dom';
export default {
    preset: "ts-jest/presets/js-with-ts",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    moduleNameMapper: {
        "^axios$": "axios/dist/node/axios.cjs", // Force CommonJS version of Axios
    },
    setupFilesAfterEnv: ['ui/App.test.tsx', "./jest.setup.ts"],
    moduleDirectories: [
        'node_modules',
        'src'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        "node_modules/(?!axios)",
    ],
};