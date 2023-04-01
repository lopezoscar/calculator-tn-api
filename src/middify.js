const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpErrorHandler = require('@middy/http-error-handler')
const doNotWaitForEmptyEventLoop = require('@middy/do-not-wait-for-empty-event-loop')

module.exports = (fn) => {
  return middy(fn)
    .use(doNotWaitForEmptyEventLoop()) // Only with MongoDB
    .use(jsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler()) // always at last
}
