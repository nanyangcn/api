import Avj, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

import { DecodedToken, loginReqSchema } from 'src/types/login.type';

const ajv = new Avj();
addFormats(ajv);

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

const todoReqWithTokenSchema: JSONSchemaType<TodoReq> = {
  type: 'object',
  required: [
    'userId',
    'title',
    'done',
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
      format: 'date',
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const todoReqWithTokenValidate = ajv
  .addSchema(loginReqSchema)
  .compile(todoReqWithTokenSchema);
