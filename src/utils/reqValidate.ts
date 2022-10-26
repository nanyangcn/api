import { ValidateFunction } from 'ajv';
import errUtil from 'src/utils/error.util';

const reqValidate = <T>(body: T, validate: ValidateFunction<T>) => {
  if (!validate(body)) {
    throw errUtil.errorWrapper(
      'TypeValidationError',
      JSON.stringify(validate.errors?.[0]),
    );
  }
};

export default {
  reqValidate,
};
