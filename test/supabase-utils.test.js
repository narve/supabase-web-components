import {expect, test} from '@jest/globals';

import {api as sampleApi} from './openapi-sample.js'

import {getPathArray, getPathObjects, getPaths, getSchema} from '../src/openapi-utils.js'
import {getFatSelect, getFKRef, getFKs} from "../src/supabase-utils.js";


test('itShouldExtractSchema', () => {
    const schema = getSchema(sampleApi, '/item', 'get')
    expect(schema).not.toBeUndefined()
    expect(schema.description).toEqual('Gjenstand')
    expect(schema.properties).not.toBeUndefined()
    expect(Object.entries(schema.properties).length).toEqual(3)
})


test('itShouldExtractFKs', () => {
    const schema = getSchema(sampleApi, '/item', 'get')
    const fks = getFKs(schema)
    expect(fks).not.toBeUndefined()
    expect(fks.length).toEqual(1)
    const fk = fks[0]
    expect(fk[0]).toEqual('location')
    expect(fk[1].description).not.toBeNull()
    expect(fk[1].description.substring(0, "Current location".length)).toEqual("Current location")

    const fkRef = getFKRef(fk[0], fk[1])
    expect(fkRef).toEqual(['location', 'id'])
})

test('itShouldGenerateFatQueryForItem', () => {
    const fatSelect = getFatSelect(sampleApi, '/item')
    expect(fatSelect).toEqual('*, location (id, name)')
})
test('itShouldGenerateFatQueryForAnswer', () => {
    const fatSelect = getFatSelect(sampleApi, '/answer')
    expect(fatSelect).toEqual('*, student_id (id, name), question_id (id, name), questionnaire_id (id, name)')
})