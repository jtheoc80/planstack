// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        color: 'white', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        Hello, Planstack!
      </h1>
      <Link href="/app" style={{
        padding: '1rem 2rem',
        background: 'white',
        color: '#667eea',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s'
      }}>
        Launch Application →
      </Link>
    </div>
  );
}
