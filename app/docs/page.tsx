export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Documentation</h1>
      <p className="text-xl text-text-secondary mb-12">Learn how to integrate Pay For API into your applications.</p>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-brand-yellow">Authentication</h2>
          <div className="card p-6">
            <p className="mb-4 text-text-secondary">
              We don't use traditional API keys. Instead, every request is authenticated by proving you made a payment on the Celo blockchain.
            </p>
            <p className="mb-4 text-text-secondary">
              Include these headers in your HTTP request:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary font-mono text-sm mb-6">
              <li>X-Wallet-Address: Your Celo wallet address</li>
              <li>X-Payment-Token: Token symbol (e.g., cUSD)</li>
            </ul>
            <p className="text-text-secondary">
              And include the <code className="text-brand-green">txHash</code> in your JSON body.
            </p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-4 text-brand-green">Endpoints</h2>
          
          <div className="space-y-6">
            <div className="card p-6 border-l-4 border-l-brand-yellow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">AI Chat Completion</h3>
                <span className="badge bg-brand-yellow/10 text-brand-yellow">POST /api/chat</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">Price: 0.001 cUSD</p>
              
              <h4 className="text-sm font-bold text-white mb-2">Request Body</h4>
              <pre className="code-block text-xs mb-4">
{`{
  "message": "Explain quantum computing in simple terms",
  "walletAddress": "0x...",
  "tokenSymbol": "cUSD",
  "txHash": "0x..."
}`}
              </pre>
            </div>
            
            {/* More endpoints can be added here */}
          </div>
        </section>
      </div>
    </div>
  );
}
