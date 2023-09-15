export type SchemaFormComponent = (props: {
  value: any;
  onChange: (value: any) => void;
}) => JSX.Element;

export class SchemaFormRegister {
  private components: Map<string, SchemaFormComponent> = new Map();

  public register(name: string, component: SchemaFormComponent) {
    this.components.set(name, component);
  }

  public get(name: string) {
    return this.components.get(name);
  }
}

export const schemaFormRegister = new SchemaFormRegister();
