import { FormComponentProps } from "./SchemaForm";

export type SchemaFormComponent<T = any> = (
  props: FormComponentProps<T>
) => JSX.Element;

export class SchemaFormRegister {
  private components: Map<string, SchemaFormComponent>;
  public constructor(components: Map<string, SchemaFormComponent>) {
    this.components = components;
  }

  public register(name: string, component: SchemaFormComponent) {
    this.components.set(name, component);
  }

  public get(name: string) {
    return this.components.get(name);
  }
}

export const schemaFormRegister = new SchemaFormRegister(new Map());
