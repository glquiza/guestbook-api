import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const API_URL = 'http://localhost:3000/api/messages';

  // Helper function to fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // TODO 4: Fetch messages when the component loads
  useEffect(() => {
    fetchMessages();
  }, []);

  // TODO 5: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Send POST request to API_URL
      // 2. Set headers: { 'Content-Type': 'application/json' }
      // 3. Send body: JSON.stringify({ name, message })
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      // 4. Clear the form and re-fetch the messages
      setName('');
      setMessage('');
      await fetchMessages();
    } catch (err) {
      console.error('Error submitting message:', err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>My Portfolio Guestbook</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ padding: '8px', fontSize: '15px' }}
        />
        <input 
          type="text" 
          placeholder="Your Message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          style={{ padding: '8px', fontSize: '15px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign Guestbook
        </button>
      </form>

      <div>
        <h3>Messages ({messages.length})</h3>
        {messages.length === 0 ? (
          <p>No messages yet. Be the first to leave one!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ border: '1px solid #ccc', borderRadius: '6px', margin: '10px 0', padding: '12px', textAlign: 'left' }}>
              <strong>{msg.name}</strong> says:
              <p style={{ margin: '8px 0' }}>{msg.message}</p>
              <small style={{ color: '#888' }}>
                {new Date(msg.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;