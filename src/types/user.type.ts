import Avj, { JSONSchemaType } from 'ajv';

import { DecodedToken, loginReqSchema } from 'types/login.type';
import { Todo } from 'types/todo.type';

const ajv = new Avj();

export interface UserReq {
  username: string;
  password: string;
}

export interface User {
  id?: string;
  username: string;
  passwordHash?: string;
  todos: Todo[];
}

const userReqSchema: JSONSchemaType<UserReq> = {
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
export const userReqValidate = ajv.compile(userReqSchema);

export interface UserReqWithToken extends UserReq {
  decodedToken: DecodedToken
}

const userReqWithTokenSchema: JSONSchemaType<UserReqWithToken> = {
  type: 'object',
  required: [
    'username',
    'password',
    'decodedToken',
  ],
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    decodedToken: {
      $ref: 'loginReqSchema',
    },
  },
  additionalProperties: false,
};

export const userReqWithTokenValidate = ajv
  .addSchema(loginReqSchema)
  .compile(userReqWithTokenSchema);
