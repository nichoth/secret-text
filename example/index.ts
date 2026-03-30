import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'secret-text')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <div style="padding: 2rem; max-width: 480px;">
        <p style="margin: 0 0 0.5rem; font-size: 0.8rem; color: #555;">
            API Key
        </p>
        <secret-text value="sk-proj-abc123def456ghi789jklmno"></secret-text>

        <p style="margin: 1.5rem 0 0.5rem; font-size: 0.8rem; color: #555;">
            Webhook Secret
        </p>
        <secret-text
            value="whsec_8xTz3mNqK2pLrV9hJwYcFuDsAeGbIo"
            visible
        ></secret-text>
    </div>
`
