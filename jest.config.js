module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Direct Jest to the actual package location for @worldcoin/idkit
    // This helps jest.requireActual find the module.
    '^@worldcoin/idkit$': '<rootDir>/node_modules/@worldcoin/idkit',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Ensure that @worldcoin/idkit and its dependencies (if they are ESM or need transformation)
  // are NOT ignored by transformations.
  transformIgnorePatterns: [
    // Default: '/node_modules/'
    // We need to un-ignore @worldcoin/idkit and potentially related packages if they are ESM.
    // This regex means "ignore node_modules unless it's @worldcoin/idkit or @signalapp/*"
    // Adjust if other specific @worldcoin dependencies need transformation.
    '<rootDir>/node_modules/(?!(@worldcoin/idkit|@signalapp/.*)/)', 
  ],
  testPathIgnorePatterns: [
    // '<rootDir>/node_modules/', // Covered by transformIgnorePatterns logic now
    '<rootDir>/.next/',
  ],
};
