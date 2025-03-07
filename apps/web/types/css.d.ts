declare module "*.css" {
  const styles: { [key: string]: string };
  export default styles;
}

declare module "*.css?url" {
  const url: string;
  export default url;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
