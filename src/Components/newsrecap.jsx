import React, { useState, useEffect } from 'react'
import './newsrecap.css'
import axios from 'axios'

const NewsRecap = () => {
    const [recap, setRecap] = useState([])
    const [briefing, setBriefing] = useState([])
    const [recapNews, setRecapNews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
                const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
                
                const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${GNEWS_API_KEY}`
                const response = await axios.get(url)
                const fetchedNews = response.data.articles
                setRecapNews(fetchedNews.slice(0, 6))
                const articlesforAI = fetchedNews.slice(0, 6).map((article, index) => 
                    `Story ${index + 1}: ${article.title}-${article.description}`,
                ).join('\n')
                
                const prompt = `Create a 3-minute news briefing from these top stories. Write it as a flowing summary like a professional news broadcast the name of the news station is "The Daily Brief" the name of the anchor is "Ibukunoluwa Arotiba" that takes exactly 3 minutes to read (450-500 words). Focus on the most important facts and present them like a professional news anchor would. Here are today's top stories: ${articlesforAI}. Make it engaging and informative, covering each story briefly but completely.`
                
                const AIresponse = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                          role: 'user',
                          content: prompt
                        }
                    ],
                    max_tokens: 700,
                    temperature: 0.3
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                })
                
                const aiSummary = AIresponse.data.choices[0].message.content
                setRecap(aiSummary)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching news:', error)
                setLoading(false)
            }
        }

        fetchNews()
    }, [])
    
    return (
        <div className="newsrecap">
            <h1>Today's News Briefing</h1>
            {loading ? (
                <p className="loading">Loading today's top stories...</p>
            ) : (
                <div className="recap-content">
                    <h2>Your 3-Minute Update</h2>
                    <p className="recap-text">{recap}</p>
                </div>
            )}
        </div>
    )
}

export default NewsRecap
