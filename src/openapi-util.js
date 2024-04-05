/**
 * @typedef OpenAPI
 * @prop {string} swagger
 * @prop {object} info
 * @prop {object} paths
 */

/** Returns a string[] of all the paths in the OpenAPI document,
 *    excluding the root path /.
 * @returns string[]
 * @param api {OpenAPI}
 */
export const getPaths = (api) =>
    Object.keys(api.paths)
        .filter(p => p !== '/')

/** Returns an array of [string, object] pairs, where the string is the path, and the object is the path object,
 *   excluding the root path /.
 * @returns [string, object][]
 * @param api {OpenAPI}
 */
export const getPathArray = (api) =>
    Object.entries(api.paths)
        .filter(([p, _]) => p !== '/')

/** Returns an array of objects, where each object has the path, the path object,
 *   and a title property which is either the summary of the operation or just the path,
 *   excluding the root path /.
 * @returns {{path: string, title: string, object: object}[]}
 * @param {OpenAPI} api
 */
export const getPathObjects = (api) =>
    getPathArray(api)
        .map(([path, object]) => ({
            path,
            object,
            title: object.get?.summary || object.post?.summary || path
        }))



