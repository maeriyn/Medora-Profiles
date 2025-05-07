import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Medora Systems</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Dashboard</li>
            <li>Settings</li>
          </ul>
        </nav>
      </header>
      
      <div className="main-content">
        <aside className="sidebar">
          <h2>Navigation</h2>
          <ul>
            <li>Medical Data</li>
            <li>Legal Data</li>
            <li>Education Data</li>
          </ul>
        </aside>
        
        <main className="content">
          <h2>Welcome to Medora Systems</h2>
          <p>This is a basic layout structure for the application.</p>
          <div className="status-card">
            <h3>System Status</h3>
            <p>✅ All systems operational</p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
