import { Group } from "./components/Group";

import { schemaFormRegister } from "./register";

export { SchemaForm as ConfigPanel } from "./SchemaForm";
export type {
  SchemaFormProps as ConfigPanelProps,
  SchemaType as ConfigPanelSchema,
  FromValue as Store,
  FromItemValue as StoreValue,
} from "./SchemaForm";
schemaFormRegister.register("group", Group);
export { schemaFormRegister };
