import {api as sampleApi} from './openapi-sample.js'

import {expect, test} from '@jest/globals';

import {getPathArray, getPathObjects, getPaths} from '../src/openapi-util.js'


test('itShouldExtractPaths', () => {
    const paths = getPaths(sampleApi)
        .toSorted()
        .slice(0,5)
    const exp = ['/answer', '/assignment', '/ceremony_statistics', '/countries', '/course']
    expect(paths).toStrictEqual(exp)
})

test('itShouldExtractPathArray', () => {
    const act = getPathArray(sampleApi)
        .toSorted()
        .slice(0,1)
        [0]
    const exp = ['/answer', {}]
    expect(act[0]).toBe(exp[0])
    expect(!!act[1]).toBe(true)
    expect(!!act[1]["get"]).toBe(true)
    expect(act[1]["get"]["summary"]).toBe('Besvarelse')
})

test('itShouldExtractPathObjects', () => {
    const act = getPathObjects(sampleApi)
        .toSorted( (a,b)=> a.path.localeCompare(b.path) )
        .slice(0,1)
        [0]
    const exp = {path: '/answer', title: 'Besvarelse', object: {}}
    expect(act.path).toBe(exp.path)
    expect(!!act.object.get).toBe(true)
    expect(!!act.object.get.summary).toBe(true)
    expect(act.title).toBe(exp.title)
})
