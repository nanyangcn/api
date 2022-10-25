import Ajv, { JSONSchemaType } from 'ajv';
import addParameters from 'ajv-formats';

const ajv = new Ajv();
addParameters(ajv);

export const idSchema: JSONSchemaType<string> = {
  type: 'string',
  format: 'byte',
};

export const idValidate = ajv.compile(idSchema);
