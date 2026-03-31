import { WebComponent } from '@substrate-system/web-component'
import { define as defineElement } from '@substrate-system/web-component/util'
import Debug from '@substrate-system/debug'
import { define as eyeSlashDefine } from '@substrate-system/icons/eye-slash'
import { define as eyeRegularDefine } from '@substrate-system/icons/eye-regular'
import {
    CopyButton,
    define as copyButtonDefine
} from '@substrate-system/copy-button'

const debug = Debug('secret-text')
const BULLET = '\u2022'

eyeSlashDefine()
eyeRegularDefine()
copyButtonDefine()

export function define () {
    return SecretText.define()
}

export interface CopyEvent extends CustomEvent<{ value:string }> {
    type:'secret-text:copy'
}

export interface ShowEvent extends CustomEvent<{ isVisible:boolean }> {
    type:'secret-text:show'
}

export interface HideEvent extends CustomEvent<{ isVisible:boolean }> {
    type:'secret-text:hide'
}

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'secret-text':SecretText
    }
    interface HTMLElementEventMap {
        'secret-text:copy':CopyEvent
        'secret-text:show':ShowEvent
        'secret-text:hide':HideEvent
    }
}

export class SecretText extends WebComponent.create('secret-text') {
    static observedAttributes = ['visible', 'value']

    static define () {
        return defineElement(SecretText.TAG, SecretText)
    }

    set isVisible (val:boolean) {
        if (val) this.setAttribute('visible', '')
        else this.removeAttribute('visible')
    }

    get isVisible ():boolean {
        return this.hasAttribute('visible')
    }

    get value ():string {
        return this.getAttribute('value') || ''
    }

    connectedCallback () {
        debug('connected')
        this.render()
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    async attributeChangedCallback (
        name:string,
        _oldValue:string,
        _newValue:string
    ) {
        debug('attribute changed', name)
        if (name === 'visible') {
            this._reRenderEye()
            this._updateDisplay()
        } else if (name === 'value') {
            this._updateDisplay()
            this._updatePayload()
        }
    }

    private _mask ():string {
        const len = this.value.length || 12
        return BULLET.repeat(len)
    }

    private _reRenderEye () {
        const btn = this.querySelector('.secret-text-eye-btn')
        if (!btn) return
        btn.innerHTML = this._eyeContent()
        btn.setAttribute('aria-label', this.isVisible ?
            'Hide secret' :
            'Show secret'
        )
    }

    private _updateDisplay () {
        const el = this.querySelector('.secret-text-value')
        if (!el) return
        el.textContent = this.isVisible ? this.value : this._mask()
    }

    private _updatePayload () {
        const copyBtn = this.querySelector(CopyButton.TAG)
        if (!copyBtn) return
        copyBtn.setAttribute('payload', this.value)
    }

    private _eyeContent ():string {
        const label = this.isVisible ? 'Hide secret' : 'Show secret'
        const icon = this.isVisible ?
            '<eye-slash></eye-slash>' :
            '<eye-regular></eye-regular>'
        return `${icon} <span class="visually-hidden">${label}</span>`
    }

    private _attachListeners () {
        const eyeBtn = this.querySelector('.secret-text-eye-btn')
        const copyBtn = this.querySelector(CopyButton.TAG)

        eyeBtn?.addEventListener('click', (ev:Event) => {
            ev.preventDefault()
            this.isVisible = !this.isVisible
            this.emit(this.isVisible ? 'show' : 'hide', {
                bubbles: true,
                detail: { isVisible: this.isVisible }
            })
        })

        copyBtn?.addEventListener('copy', (ev:Event) => {
            ev.stopPropagation()
            this.emit('copy', {
                bubbles: true,
                detail: { value: this.value }
            })
        })
    }

    render () {
        const display = this.isVisible ? this.value : this._mask()
        const eyeLabel = this.isVisible ? 'Hide secret' : 'Show secret'
        this.innerHTML = `<div class="secret-text-inner">
            <span class="secret-text-value" aria-live="polite">
                ${display}
            </span>
            <div class="secret-text-actions">
                <button
                    class="secret-text-eye-btn"
                    type="button"
                    aria-label="${eyeLabel}"
                >${this._eyeContent()}</button>
                <${CopyButton.TAG}></${CopyButton.TAG}>
            </div>
        </div>`

        this.querySelector(CopyButton.TAG)?.setAttribute('payload', this.value)
        this._attachListeners()
    }
}

define()
