import { useNavigate } from 'react-router-dom'
import './Modalities.css'

export default function Modalities() {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(`/modalities/${path.toLowerCase()}`);
  };

  return (
    <div className="modalities">
      <div className="content-wrapper">
        <h1 className="title">Our Modalities</h1>
        <div className="modalities-content">
          <p className="modalities-text">
            Explore our diverse range of data generation capabilities across multiple domains:
          </p>
          <div className="modalities-grid">
            <div className="modality-card" onClick={() => handleCardClick('healthcare')}>
              <h2>Healthcare</h2>
              <p>Medical records, clinical trials, and patient histories</p>
            </div>
            <div className="modality-card" onClick={() => handleCardClick('financial')}>
              <h2>Financial</h2>
              <p>Banking records, tax documents, and investment portfolios</p>
            </div>
            <div className="modality-card" onClick={() => handleCardClick('educational')}>
              <h2>Education</h2>
              <p>Academic transcripts, test scores, and learning analytics</p>
            </div>
            <div className="modality-card" onClick={() => handleCardClick('legal')}>
              <h2>Legal</h2>
              <p>Contracts, court records, and legal documentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
