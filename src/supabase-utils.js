import {getPaths, getSchema} from './openapi-utils.js'


/** Returns a suitable select-part.
 * @returns string
 * @param api {OpenAPI}
 * @param path {string}
 */
export const getFatSelect = (api, path) => {
    const schema = getSchema(api, path, 'get')
    const fks = getFKs(schema)


    let select = "*";
    for (const fkProp of fks) {


        // const referencedTableLabelColumn = 'name'
        const [table, column] = getFKRef(fkProp[0], fkProp[1])

        if(table === 'user') {
            // This does not work, as 'user' is a view, and auth.users is not visible :(
            continue
        }

        const referencedSchema = getSchema(api, `/${table}`, 'get')
        const candidates = ['name', 'title', 'label', 'description', 'email', column, 'id']
        const referencedTableLabelColumn = candidates.find(c => c in referencedSchema.properties) || 'id'
        // select += `, ${fk.fk.table}!${fk.name} ( id, ${fk.fk.select} )`;
        // select += `, ${fk.fk.table}!${fk.fk.fk_name} ( id, ${fk.fk.select} )`;

        // NB: To include fk-name, use this:
        // select += `, ${fkProp[0]}!${fkName} (${column}, ${referencedTableLabelColumn})`;

        select += `, ${fkProp[0]} (${column}, ${referencedTableLabelColumn})`;
    }

    return select
}

export const isFK = (prop) => {
    return prop.description?.indexOf('<fk') >= 0
}

export const getFKs = (schema) => {
    return Object.entries(schema.properties)
        .filter(([_, value]) => isFK(value))
}

export const getFKRef = (fkName, fkObj) => {
    const parts = /.*<fk table='(.*)' column='(.*)'\/>.*/.exec(fkObj.description);
    const table = parts[1]
    const column = parts[2]
    return [table, column]
}