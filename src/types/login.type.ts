import Avj, { JSONSchemaType } from 'ajv';

const ajv = new Avj();

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
  iat: number;
  exp: number;
}

export const tokenSchema: JSONSchemaType<DecodedToken> = {
  $id: 'tokenSchema',
  type: 'object',
  required: [
    'username',
    'id',
    'iat',
    'exp',
  ],
  properties: {
    username: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
    iat: {
      type: 'number',
    },
    exp: {
      type: 'number',
    },
  },
  additionalProperties: false,
};

export const tokenValidate = ajv.compile(tokenSchema);
