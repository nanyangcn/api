import Avj, { JSONSchemaType } from 'ajv';
import addParameters from 'ajv-formats';

const ajv = new Avj();
addParameters(ajv);

export interface LoginReq {
  username: string;
  password: string;
}

export const loginReqSchema: JSONSchemaType<LoginReq> = {
  $id: 'loginReqSchema',
  type: 'object',
  required: [
    'username',
    'password',
  ],
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  additionalProperties: false,
};

export const loginReqValidate = ajv.compile(loginReqSchema);

export interface DecodedToken {
  username: string;
  id: string;
}

export const tokenSchema: JSONSchemaType<DecodedToken> = {
  type: 'object',
  required: [
    'username',
    'id',
  ],
  properties: {
    username: {
      type: 'string',
    },
    id: {
      type: 'string',
      format: 'byte',
    },
  },
  additionalProperties: false,
};

export const tokenValidate = ajv.compile(tokenSchema);
