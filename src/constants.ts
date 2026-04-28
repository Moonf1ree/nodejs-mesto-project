const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const JWT_SECRET = 'dev-secret';

const URL_REGEX = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)#?$/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export {
  STATUS_CODES,
  JWT_SECRET,
  URL_REGEX,
  OBJECT_ID_REGEX,
};
