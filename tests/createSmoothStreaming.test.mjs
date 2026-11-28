import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a dependency.
import { test } from 'node:test'
import { createRoot } from 'solid-js'

import { createSmoothStreaming } from '../src/hooks/createSmoothStreaming.ts'

let time = 0
let frameId = 0
const frames = new Map()

globalThis.requestAnimationFrame = (callback) => {
  const id = ++frameId
  frames.set(id, callback)
  return id
}
globalThis.cancelAnimationFrame = (id) => {
  frames.delete(id)
}

function setup(t) {
  time = 0
  t.mock.method(performance, 'now', () => time)
  const archived = []
  const stream = createRoot((dispose) => {
    t.after(() => {
      dispose()
      frames.clear()
    })
    return createSmoothStreaming({ onDone: content => archived.push(content) })
  })
  return { stream, archived }
}

function advanceFrames() {
  for (let i = 0; i < 240 && frames.size; i++) {
    time += 1000 / 60
    const callbacks = [...frames.values()]
    frames.clear()
    for (const callback of callbacks) callback(time)
  }
}

test('archives consecutive chunks including trailing whitespace on normal finish', (t) => {
  const { stream, archived } = setup(t)
  stream.start()
  stream.append('hello')
  stream.append(' world')
  advanceFrames()
  assert.equal(stream.currentAssistantMessage(), 'hello world')
  stream.append('  \n')
  advanceFrames()
  assert.equal(stream.currentAssistantMessage(), 'hello world')
  stream.finish()
  assert.deepEqual(archived, [])
  advanceFrames()
  assert.deepEqual(archived, ['hello world  \n'])
  assert.equal(stream.currentAssistantMessage(), '')
})

test('archives an interrupted stream immediately and only once', (t) => {
  const { stream, archived } = setup(t)
  stream.start()
  stream.append('partial')
  stream.append(' reply')
  stream.finish(true)
  assert.deepEqual(archived, ['partial reply'])
  advanceFrames()
  assert.deepEqual(archived, ['partial reply'])
  assert.equal(stream.currentAssistantMessage(), '')
})

for (const reset of ['start', 'clear']) {
  test(`${reset} discards buffered content`, (t) => {
    const { stream, archived } = setup(t)
    stream.start()
    stream.append('discarded')
    stream[reset]()
    stream.append('new reply')
    stream.finish(true)
    advanceFrames()
    assert.deepEqual(archived, ['new reply'])
  })
}
