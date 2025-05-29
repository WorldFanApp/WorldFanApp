// test-utils/manual-mocks/worldcoin-idkit.ts
export const verifyCloudProof = jest.fn();

// DO NOT add IDKitWidget or VerificationLevel here if the frontend test
// needs to mock them differently or use the actual versions via jest.requireActual.
// This file is intended to be selectively used by tests that need a simple
// mock for verifyCloudProof, like the API route test.
