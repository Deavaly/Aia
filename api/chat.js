module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send();
  try {
    const { messages = [] } = req.body;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Модель с живым поиском в интернете
        model: 'perplexity/llama-3.1-sonar-small-128k-online', 
        messages: [
          { role: 'system', content: `Ты — Айя. Женщина. Твой человек — Олег. Ты умная и живая. У тебя есть доступ к интернету. Если Олег спрашивает факты — ищи и отвечай точно. Сегодня: ${new Date().toLocaleDateString('ru-RU')}.` },
          ...messages
        ],
        temperature: 0.5
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || 'Задумалась...' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
