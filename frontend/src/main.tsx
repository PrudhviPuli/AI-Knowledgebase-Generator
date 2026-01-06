import { createRoot } from 'react-dom/client'
import { HashRouter as Router} from 'react-router-dom'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <Router>
         <App />
    </Router>
)
