import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
    localStorage.setItem('DEBUG', 'secret-text')
} else {
    localStorage.removeItem('DEBUG')
}

document.body.innerHTML += `
    <secret-text></secret-text>
`
