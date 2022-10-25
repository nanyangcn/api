import { Request } from 'express';

const tokenExtractor = (req: Request) => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase())) {
    return null;
  }
  return authorization.substring(7);
};

export default {
  tokenExtractor,
};
