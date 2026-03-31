import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <secret-text class="test">
        </secret-text>
    `

    const el = await waitFor('secret-text')

    t.ok(el, 'should find an element')
})

test('re-emits copy-button copy event as secret-text:copy', async t => {
    t.plan(2)

    document.body.innerHTML += `
        <secret-text id="copy-test" value="abc"></secret-text>
    `

    const el = (await waitFor('#copy-test'))!

    el.addEventListener('secret-text:copy', (ev:Event) => {
        const detail = (ev as CustomEvent<{ value:string }>).detail
        t.equal(detail.value, 'abc', 'detail.value matches the element value')
    })

    const copyBtn = el.querySelector('copy-button')
    t.ok(copyBtn, 'copy-button is rendered')

    copyBtn!.dispatchEvent(new CustomEvent('copy', {
        bubbles: true,
        detail: { text: 'abc' }
    }))
})

test('all done', () => {
    // @ts-expect-error tests
    window.testsFinished = true
})
