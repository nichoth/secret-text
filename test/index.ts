import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { SecretText } from '../src/index.js'

test('re-emits copy-button copy event as secret-text:copy', async t => {
    t.plan(3)

    document.body.innerHTML += `
        <${SecretText.TAG} id="copy-test" value="abc"></${SecretText.TAG}>
    `

    const el = (await waitFor('#copy-test')) as SecretText

    el.addEventListener('secret-text:copy', (ev:Event) => {
        const detail = (ev as CustomEvent<{ value:string }>).detail
        t.equal(detail.value, 'abc', 'detail.value matches the element value')
    })

    el.on('copy', (ev:CustomEvent) => {
        const detail = ev.detail
        t.equal(detail.value, 'abc', 'the `.on` method works')
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
