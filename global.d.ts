/// <reference types="react" />

declare namespace JSX {
    interface IntrinsicElements {
      svg: React.SVGProps<SVGSVGElement>;
      path: React.SVGProps<SVGPathElement>;
    }
  }
  declare namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_API_KEY: string;
    }
  }