import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'secret-text')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <div style="padding: 2rem; max-width: 480px;">
        <span>API Key</span>
        <secret-text value="sk-proj-abc123def456ghi789jklmno"></secret-text>

        <span>Webhook Secret</span>
        <secret-text
            value="whsec_8xTz3mNqK2pLrV9hJwYcFuDsAeGbIo"
            visible
        ></secret-text>
    </div>
`
