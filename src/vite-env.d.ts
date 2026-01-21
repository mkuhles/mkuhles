/// <reference types="vite/client" />

declare module '*?*as=srcset' {
  const value: string;
  export default value;
}

declare module '*?*as=src' {
  const value: string;
  export default value;
}

// More specific patterns for common image imports
declare module '*foto-mkuhles.jpg?*' {
  const value: string;
  export default value;
}

