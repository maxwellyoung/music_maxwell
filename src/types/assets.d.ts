declare module "*.svg" {
  import type { SVGProps } from "react";
  const Component: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  export default Component;
}
