
/**
 * @typedef PathObject
 * @prop {?object} get
 * @prop {?object} post
 * @prop {?object} put
 * @prop {?object} delete
 */

/**
 * @typedef OpenAPI
 * @prop {string} swagger
 * @prop {object} info
 * @prop {PathObject} paths
 * @prop {object} definitions
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


const getRef = s => {
    const ref = s.substring(2).split('/')
    console.log('refs: ', s, ref)
    const o1 = this.api[ref[0]]
    return o1[ref[1]]
}

/** Returns the schema of the operation on the path.
 * @returns {{path: string, title: string, object: object}[]}
 * @param {OpenAPI} api
 * @param {string} path
 * @param {string} method
 */
export const getSchema = (api, path, method) => {
    const pathObject = api.paths[path]
    if(!pathObject)
        throw new Error('Schema not found for path: ' + path)
    const schemaObj = pathObject[method].responses[200].schema
    const fullRef = schemaObj.items['$ref']
    const ref = fullRef.substring(2).split('/')
    const obj1 = api[ref[0]]
    const obj2 = obj1[ref[1]]
    return obj2
 }
