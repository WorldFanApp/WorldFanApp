// __mocks__/@worldcoin/idkit.ts

// Mock specific functions or the entire module as needed by your tests.
// For the API route test, we primarily need to mock `verifyCloudProof`.

export const verifyCloudProof = jest.fn();

// If other parts of IDKitWidget (like VerificationLevel) are imported by
// the component under test (SignupPage), they might need to be mocked here too
// if jest.mock in the test file is removed.
// For SignupPage.tsx, IDKitWidget itself and VerificationLevel are imported.

export const IDKitWidget = jest.fn((props: any) => {
  // This is a simplified mock for IDKitWidget, similar to what's in page.test.tsx
  // It needs to be sufficient for the component to render without error.
  // The actual testing of IDKitWidget's behavior is done by interacting with
  // the props passed to it in the component test.
  return (
    // Needs to be valid JSX if used directly, but for moduleNameMapper,
    // the one in page.test.tsx might take precedence for that file.
    // Let's provide a basic structure.
    // The data-testid attributes used in page.test.tsx should align with this structure
    // if this global mock is intended to replace the inline one.
    // For now, the inline mock in page.test.tsx is more specific.
    // This global mock is primarily for the backend test.
    props.children({ open: jest.fn() })
  );
});


export const VerificationLevel = {
  Orb: 'orb',
  Device: 'device',
};

// Add any other named exports from @worldcoin/idkit that your application uses
// and that need to be available in the test environment.
// For example, if ISuccessResult is used in type annotations in the SUT,
// it doesn't need a mock value, but the module must resolve.
// The actual type ISuccessResult doesn't need a runtime mock here.
// type ISuccessResult = { /* ... */ }; // This is a type, not a value.
// export type { ISuccessResult }; // This is how you might re-export types if needed by compiled test code.
// However, jest.mock primarily deals with runtime values.
