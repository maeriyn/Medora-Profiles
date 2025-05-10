import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Menu.css'

// Define page routes and their searchable keywords
const pageRoutes = [
  {
    path: '/',
    keywords: ['home', 'generate', 'documents', 'synthetic', 'data', 'communities']
  },
  {
    path: '/biography',
    keywords: ['biography', 'team', 'about', 'experts', 'company']
  },
  {
    path: '/contact',
    keywords: ['contact', 'email', 'location', 'reach', 'info']
  }
]

// Calculate string similarity using Levenshtein distance
const calculateSimilarity = (str1: string, str2: string): number => {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(null));

  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return 1 - matrix[len1][len2] / Math.max(len1, len2);
}

export default function Menu() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Find best matching page based on search query
  const findBestMatch = (query: string) => {
    if (!query.trim()) return '/';
    
    let bestMatch = { path: '/search', similarity: 0 };

    pageRoutes.forEach(route => {
      route.keywords.forEach(keyword => {
        const similarity = calculateSimilarity(query, keyword);
        if (similarity > bestMatch.similarity) {
          bestMatch = { path: route.path, similarity: similarity };
        }
      });
    });

    return bestMatch.similarity > 0.3 ? bestMatch.path : '/search';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Find and navigate to best matching page
    const bestMatchPath = findBestMatch(searchQuery);
    navigate(bestMatchPath);
    setSearchQuery('');
    setIsExpanded(false);
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        document.querySelector('.search-input')?.focus();
      }, 100);
    }
  };

  return (
    <nav className="menu">
      <div className="menu-content">
        <Link to="/">HOME</Link>
        <Link to="/biography">BIOGRAPHY</Link>
        <Link to="/contact">CONTACT</Link>
        <form className="search-container" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Search..." 
            className={`search-input ${isExpanded ? 'expanded' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => {
              if (!searchQuery) setIsExpanded(false);
            }}
          />
          <svg 
            className="search-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            onClick={toggleSearch}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </form>
      </div>
    </nav>
  )
}
