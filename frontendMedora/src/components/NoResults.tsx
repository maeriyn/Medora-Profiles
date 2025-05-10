import { useNavigate } from 'react-router-dom'
import './NoResults.css'

export default function NoResults() {
  const navigate = useNavigate();
  
  return (
    <div className="no-results">
      <div className="content-wrapper">
        <h1>No Results Found</h1>
        <p>We couldn't find what you were looking for.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  )
}
