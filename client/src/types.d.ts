// Type declarations for the project
// This file exists to satisfy TypeScript config requirements

declare module '*.jsx' {
  const component: React.ComponentType<any>;
  export default component;
}

declare module '*.js' {
  const value: any;
  export default value;
}
