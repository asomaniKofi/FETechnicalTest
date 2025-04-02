// jest.setup.js
import 'mutationobserver-shim';
import '@testing-library/jest-dom';
global.MutationObserver = class {
  observe() { }
  disconnect() { }
  takeRecords() {
    return [];
  }
};