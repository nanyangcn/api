import Avj, { JSONSchemaType } from 'ajv';

import { DecodedToken, tokenSchema } from 'src/types/login.type';

const ajv = new Avj();

export interface TodoReq {
  userId: string;
  title: string;
  description?: string;
  done: boolean;
  deadline?: Date | string;
}

export interface Todo extends TodoReq {
  id?: string;
}

export interface TodoReqWithToken extends TodoReq {
  decodedToken: DecodedToken
}

const todoReqWithTokenSchema: JSONSchemaType<TodoReqWithToken> = {
  type: 'object',
  required: [
    'userId',
    'title',
    'done',
    'decodedToken',
  ],
  properties: {
    userId: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
      nullable: true,
    },
    done: {
      type: 'boolean',
    },
    deadline: {
      type: 'string',
      nullable: true,
    },
    decodedToken: {
      $ref: 'tokenSchema',
    },
  },
  additionalProperties: false,
};

export const todoReqWithTokenValidate = ajv
  .addSchema(tokenSchema)
  .compile(todoReqWithTokenSchema);
