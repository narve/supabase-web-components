import {getSchema} from './openapi-utils.js'


/** Returns a suitable select-part.
 * @returns string
 * @param api {OpenAPI}
 * @param path {string}
 */
export const getFatSelect = (api, path) => {
    const schema = getSchema(api, path, 'get')

    const mainTable = path.substring(1)

    let selects = []
    for (const [colName, colInfo] of Object.entries(schema.properties)) {
        if (isFK(colInfo) && colName.indexOf('_by') < 0) {

            // const referencedTableLabelColumn = 'name'
            const [table, column] = getFKRef(colName, colInfo)

            if (table === 'users') {
                // This does not work without special care, as 'user' is a view, and auth.users is not visible :(
                // const name = colName.split("_")[0]
                selects.push(`${colName} : users!${mainTable}_${colName}_fkey (id, email)`)
            } else {
                const referencedSchema = getSchema(api, `/${table}`, 'get')
                const candidates = ['name', 'title', 'label', 'description', 'email', column, 'id']
                const referencedTableLabelColumn = candidates.find(c => c in referencedSchema.properties) || 'id'
                // select += `, ${fk.fk.table}!${fk.name} ( id, ${fk.fk.select} )`;
                // select += `, ${fk.fk.table}!${fk.fk.fk_name} ( id, ${fk.fk.select} )`;

                // NB: To include fk-name, use this:
                // select += `, ${fkProp[0]}!${fkName} (${column}, ${referencedTableLabelColumn})`;

                selects.push(`${colName} (${column}, ${referencedTableLabelColumn})`);

            }

        } else {
            selects.push(colName)
        }
    }
    return selects.join(', ')
    //
    // const fks = getFKs(schema)
    //
    //
    // let select = "*";
    // for (const fkProp of fks) {
    //
    //
    //     // const referencedTableLabelColumn = 'name'
    //     const [table, column] = getFKRef(fkProp[0], fkProp[1])
    //
    //     if(table === 'users') {
    //         select += ', owner(id, email)'
    //         // This does not work, as 'user' is a view, and auth.users is not visible :(
    //         continue
    //     }
    //
    //     const referencedSchema = getSchema(api, `/${table}`, 'get')
    //     const candidates = ['name', 'title', 'label', 'description', 'email', column, 'id']
    //     const referencedTableLabelColumn = candidates.find(c => c in referencedSchema.properties) || 'id'
    //     // select += `, ${fk.fk.table}!${fk.name} ( id, ${fk.fk.select} )`;
    //     // select += `, ${fk.fk.table}!${fk.fk.fk_name} ( id, ${fk.fk.select} )`;
    //
    //     // NB: To include fk-name, use this:
    //     // select += `, ${fkProp[0]}!${fkName} (${column}, ${referencedTableLabelColumn})`;
    //
    //     select += `, ${fkProp[0]} (${column}, ${referencedTableLabelColumn})`;
    // }
    //
    // return select
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