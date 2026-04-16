const { HttpError } = require('./httpError');

function validate(schema, data) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation error', parsed.error.flatten());
  }
  return parsed.data;
}

module.exports = { validate };

