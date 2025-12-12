declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.ico" {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react-syntax-highlighter';
declare module 'react-syntax-highlighter/dist/esm/styles/prism';
declare module 'react-syntax-highlighter/dist/esm/styles/hljs';
