import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Business from '../assets/Images/Business.jpeg'
import Entertainment from '../assets/Images/Entertainment.jpeg'
import Health from '../assets/Images/Health.jpeg'
import Science from '../assets/Images/Science.jpeg'
import Sport from '../assets/Images/Sport.jpeg'
import Technology from '../assets/Images/Tech.jpeg'
import World from '../assets/Images/World.jpeg'
import Nation from '../assets/Images/Nation.jpg'
import Local from '../assets/Images/Local.jpeg' 
import NoImage from '../assets/Images/NoImage.jpeg'
import Newsapplogo from '../assets/Images/Newsapplogo.jpg'
import './News.css'
import axios from 'axios'
import NewsModal from './NewsModal'

const categories = ['general', 'world', 'business', 'technology', 'entertainment',
   'sports', 'science', 'health', 'nation']

const News = () => {
  const [headline, setHeadline] = useState(null)
  const [news, setNews] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [location, setLocation] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [localNewsSummary, setLocalNewsSummary] = useState(null)
  const [localNews, setLocalNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
      const url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=${GNEWS_API_KEY}`
      const response = await axios.get(url)

      const fetchedNews = response.data.articles

      fetchedNews.forEach((article) => {
        if (!article.image) {
          article.image = NoImage
        }
      })

      setHeadline(fetchedNews[0])
      setNews(fetchedNews.slice(1, 7))

      console.log(news)
    }

    fetchNews()
  }, [selectedCategory])

  useEffect(() => {
    const fetchlocation = async () => {
      const IPGEO_API_KEY = import.meta.env.VITE_IPGEO_API_KEY
      const url = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=${IPGEO_API_KEY}`
      const response = await axios.get(url)
      const fetchedLocation = response.data.location
      setLocation({
        city: fetchedLocation.city,
        state: fetchedLocation.state_prov,
        county: fetchedLocation.district,
        zipcode: fetchedLocation.zipcode      
      })
    }
      
    fetchlocation()
  }, [])

  const fetchlocalNews = async () => {
    if (!location || location === '') return; 
    try {
      const url = `https://gnews.io/api/v4/search?q=${location.county} ${location.state}&lang=en&apikey=${GNEWS_API_KEY}`
      const response = await axios.get(url)
    const fetchedNews = response.data.articles.slice(0, 6)
    setLocalNews(fetchedNews)
      const localNewsSummary = {
      title: `${location.county}, ${location.state} LocalNews`,
      description: `Here are the latest local news from ${location.city}, ${location.state}`,
      content: fetchedNews.map((article, index) => 
        `${index + 1}: ${article.title}-${article.description}`,
      ).join('\n'),
      source: {name: 'LocalNews'},
      publishedAt: new Date().toISOString(),
      image: fetchedNews[0]?.image || NoImage,
      isLocalNews: true
    }
    setLocalNewsSummary(localNewsSummary)
      setSelectedArticle(localNewsSummary)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching local news:', error)
    }
  }

  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    setSelectedCategory(category)
  }

  const handleArticleClick = (article) => {
    setSelectedArticle(article)
    setShowModal(true)

    console.log(article)
  }

  return (
    <div className="news-app">
      <div className="news-header">
        <img src={Newsapplogo} alt="News App Logo" />
        <h1 className="logo">News App</h1>
      </div>
      <Link to="/newsrecap" className="summary-container">
        <h1 className="logo">News Recap</h1>    
      </Link>
      <div className="local-news-container" onClick={fetchlocalNews}>
        
        <h1 className="logo">Local News - {location.county}, {location.state}</h1>
      </div>
      <div className="news-content">
        <nav className="navbar">
          <h1 className="nav-heading">Categories</h1>
          <div className="categories">
            {categories.map((category) => (
              <a
                href="#"
                className="nav-link"
                key={category}
                onClick={(e) => handleCategoryClick(e, category)}
              >
                {category}
              </a>
            ))}
          </div>
        </nav>
        <div className="news-section">
          {headline && (
            <div className="headline" onClick={() => handleArticleClick(headline)}>
              <img src={headline.image || NoImage} alt={headline.title} />
              <h2 className="headline-title">{headline.title}</h2>
            </div>
          )}

          <div className="news-grid">
            {news.map((article, index) => (
              <div
                className="news-grid-item"
                key={index}
                onClick={() => handleArticleClick(article)}
              >
                <img src={article.image || NoImage} alt={article.title} />
                <h3>{article.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <NewsModal 
        show={showModal} 
        article={selectedArticle}
        onClose={() => setShowModal(false)} />
      </div>
      <footer>
        <p className="copyright">
          <span>News App</span>
        </p>
      </footer>
    </div>
  )
}

export default News




