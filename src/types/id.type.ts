import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

export const idSchema: JSONSchemaType<string> = {
  type: 'string',
};

export const idValidate = ajv.compile(idSchema);
