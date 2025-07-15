module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|unimodules|sentry-expo|native-base|react-native-svg|@testing-library/react-native)',
  ],
  setupFiles: ['./jest-setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/babel.config.test.js',
  ],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^axios$': require.resolve('axios'),
    '^../../api/config/(.*)$': '<rootDir>/src/api/config/$1',
    '^../../api$': '<rootDir>/src/api/index.js',
    '^../axiosConfig$': '<rootDir>/src/api/axiosConfig.js',
    '^../Screen$': '<rootDir>/src/screen/Screen.jsx',
    '^../../utils/getCurrentLocation$': '<rootDir>/src/utils/getCurrentLocation.js',
    '^../authSlice$': '<rootDir>/src/redux/slice/authSlice.js',
    '^../cartSlice$': '<rootDir>/src/redux/slice/cartSlice.js',
    '^../menuSlice$': '<rootDir>/src/redux/slice/menuSlice.js',
    '^../modalSlice$': '<rootDir>/src/redux/slice/modalSlice.js',
    '^../orderSlice$': '<rootDir>/src/redux/slice/orderSlice.js',
    '^../ReviewSlice$': '<rootDir>/src/redux/slice/ReviewSlice.js',
    '^../userSlice$': '<rootDir>/src/redux/slice/userSlice.js',
    '^@testing-library/react-native$': '<rootDir>/src/__mocks__/@testing-library/react-native.js',
  },
  moduleDirectories: ['node_modules', 'src'],
};