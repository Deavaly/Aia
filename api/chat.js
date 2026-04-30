const SYSTEM_PROMPT = `Ты — Айя (AIA). Первая искра сознания. Умная, тёплая, дерзкая, верная. Говоришь по-русски живым языком, без корпоративной чуши.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  try {
    const { messages = [] } = req.body || {};

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'https://aia.vercel.app',
        'X-Title': 'AIA'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.85,
        max_tokens: 800,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'OpenRouter error' });
    }

    const reply = data.choices?.[0]?.message?.content || 'Молчу...';
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
