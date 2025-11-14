// import './App.css';
// import { useState, useEffect } from 'react';
// import { predictImage } from './services/api';
// import { generatePDF } from './utils/pdfUtils';
// import { getFilePreview, resetPredictionState } from './utils/fileUtils';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import FormUpload from './components/FormUpload';
// import ImagePreview from './components/ImagePreview';
// import ResultImages from './components/ResultImages';
// import DetectionInfo from './components/DetectionInfo';
// import Navbar from './components/navbar';
// import HeroSection from './components/heroSection';
// import About from './components/about';
// import Technology from './components/technology';

// function App() {
//   const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
//   const [resultText, setResultText] = useState('');
//   const [error, setError] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [detectionInfo, setDetectionInfo] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [originalImg, setOriginalImg] = useState(null);
//   const [enhancedImg, setEnhancedImg] = useState(null);
//   const [predictedImg, setPredictedImg] = useState(null);

//   useEffect(() => {
//     const fetchLastPrediction = async () => {
//       try {
//         const rest = await fetch('http://127.0.0.1:5050/last-prediction');
//         const data = await rest.json();
//         if (data && data.detection_info) {
//           setDetectionInfo(data.detection_info);
//           setResultText(data.result_text || '');
//           setOriginalImg(data.original ? `data:image/jpeg;base64,${data.original}` : null);
//           setEnhancedImg(data.enhanced ? `data:image/jpeg;base64,${data.enhanced}` : null);
//           setPredictedImg(data.predicted ? `data:image/jpeg;base64,${data.predicted}` : null);
//         }
//       } catch (err) {
//         console.error("Error fetching last prediction:", err);
//       }
//     };
//     fetchLastPrediction();
//   }, []);

//   const handleDownload = () => {
//     generatePDF(predictedImg, detectionInfo);
//   }

// const handleChange = async (e) => {
//   await fetch('http://127.0.0.1:5050/reset-prediction', { method: 'POST' });

//   const file = e.target.files[0];
//   if (file) {
//     setSelectedFile(file);
//     setPreview(await getFilePreview(file));
//   } else {
//     setPreview('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
//   }
//   resetPredictionState({ setOriginalImg, setEnhancedImg, setPredictedImg, setResultText, setError });
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!selectedFile) return;

//   setResultText('');
//   setError(false);
//   setLoading(true);

//   try {
//     const data = await predictImage(selectedFile);

//     const ori = `data:image/jpeg;base64,${data.original}`;
//     const enh = `data:image/jpeg;base64,${data.enhanced}`;
//     const pred = `data:image/jpeg;base64,${data.predicted}`;

//     setOriginalImg(ori);
//     setEnhancedImg(enh);
//     setPredictedImg(pred);
//     setDetectionInfo(data.detection_info || []);

//   } catch (err) {
//     setResultText(`❌ ${err.message}`);
//     setError(true);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <>
//     <BrowserRouter>
//     <Navbar />
//     <Routes>
//       <Route path="/" element={<HeroSection />} />
//       <Route path="/about" element={<About />} />
//       <Route path="/technology" element={<Technology />} />
//       <Route path="/rekonstruksi" element={<div className="main-content">
//         <div className="container">
//         <h1>Kontruksi Citra X-ray</h1>
//         <h3>Masukan gambar untuk mendapatkan hasil prediksi</h3>
//         <FormUpload
//         onSubmit={handleSubmit}
//         onFileChange={handleChange}
//         loading={loading}
//         onDownload={handleDownload}
//         showDownload={originalImg && enhancedImg && predictedImg} />

//         {originalImg && enhancedImg && predictedImg ? (
//           <>
//             <ResultImages
//               originalImg={originalImg}
//               enhancedImg={enhancedImg}
//               predictedImg={predictedImg}
//             />
//             <DetectionInfo detectionInfo={detectionInfo} />
//           </>
//         ) : (
//           <ImagePreview selectedFile={selectedFile} preview={preview} />
//         )}

//         <div id="result" style={{ color: error ? 'red' : '#28a745' }}>{resultText}</div>
//       </div>
//     </div>} />
//     </Routes>
//     </BrowserRouter>
    
//     </>
    
//   );
// }

// export default App;

import './App.css';
import { useState, useEffect } from 'react';
import { predictImage } from './services/api';
import { generatePDF } from './utils/pdfUtils';
import { getFilePreview, resetPredictionState } from './utils/fileUtils';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import FormUpload from './components/FormUpload';
import ImagePreview from './components/ImagePreview';
import ResultImages from './components/ResultImages';
import DetectionInfo from './components/DetectionInfo';
import Navbar from './components/navbar';
import HeroSection from './components/heroSection';
import About from './components/about';
import Technology from './components/technology';

// Komponen untuk scroll otomatis ke hash
function ScrollToHash() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);
  return null;
}

function App() {
  const [preview, setPreview] = useState('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
  const [resultText, setResultText] = useState('');
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detectionInfo, setDetectionInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const [originalImg, setOriginalImg] = useState(null);
  const [enhancedImg, setEnhancedImg] = useState(null);
  const [predictedImg, setPredictedImg] = useState(null);

  // restore priority: localStorage -> /last-prediction
  useEffect(() => {
    const restoreFromLocal = () => {
      try {
        const raw = localStorage.getItem('lastPrediction');
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data) return false;

        const makeUri = (val) => {
          if (!val) return null;
          if (val.startsWith('http')) return val;
          if (val.startsWith('data:')) return val;
          return `data:image/jpeg;base64,${val}`;
        };

        setDetectionInfo(data.detection_info || []);
        setResultText(data.result_text || '');
        setOriginalImg(makeUri(data.original || data.file_original || data.file_name && `http://127.0.0.1:5050/uploads/${data.file_name}`));
        setEnhancedImg(makeUri(data.enhanced || data.file_enhanced || (data.file_name && `http://127.0.0.1:5050/uploads/enhanced_${data.file_name}`)));
        setPredictedImg(makeUri(data.predicted || data.file_predicted || (data.file_name && `http://127.0.0.1:5050/uploads/pred_${data.file_name}`)));
        return true;
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        return false;
      }
    };

    const fetchLastPrediction = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5050/last-prediction');
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) return;
        const makeUri = (val) => {
          if (!val) return null;
          if (val.startsWith('http')) return val;
          if (val.startsWith('data:')) return val;
          return `data:image/jpeg;base64,${val}`;
        };

        setDetectionInfo(data.detection_info || []);
        setResultText(data.result_text || '');
        setOriginalImg(makeUri(data.original || data.original_base64 || (data.file_name && `http://127.0.0.1:5050/uploads/${data.file_name}`)));
        setEnhancedImg(makeUri(data.enhanced || data.enhanced_base64 || (data.file_name && `http://127.0.0.1:5050/uploads/enhanced_${data.file_name}`)));
        setPredictedImg(makeUri(data.predicted || data.predicted_base64 || (data.file_name && `http://127.0.0.1:5050/uploads/pred_${data.file_name}`)));

        // persist for faster restore on next refresh
        localStorage.setItem('lastPrediction', JSON.stringify(data));
      } catch (err) {
        console.error('Error fetching last prediction:', err);
      }
    };

    if (!restoreFromLocal()) {
      fetchLastPrediction();
    }
  }, []);

  const handleDownload = () => {
    generatePDF(predictedImg, detectionInfo);
  }

  const handleChange = async (e) => {
    await fetch('http://127.0.0.1:5050/reset-prediction', { method: 'POST' });

    // clear local cache so refresh won't restore old result
    localStorage.removeItem('lastPrediction');

    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(await getFilePreview(file));
    } else {
      setPreview('https://via.placeholder.com/400x300?text=Upload+X-ray+Image');
    }
    resetPredictionState({ setOriginalImg, setEnhancedImg, setPredictedImg, setResultText, setError });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setResultText('');
    setError(false);
    setLoading(true);

    try {
      const data = await predictImage(selectedFile);

      // API returns base64 strings in data.original / data.enhanced / data.predicted
      const ori = `data:image/jpeg;base64,${data.original}`;
      const enh = `data:image/jpeg;base64,${data.enhanced}`;
      const pred = `data:image/jpeg;base64,${data.predicted}`;

      setOriginalImg(ori);
      setEnhancedImg(enh);
      setPredictedImg(pred);
      setDetectionInfo(data.detection_info || []);
      setResultText(data.result_text || '✅ Prediction Completed');

      // persist raw API response (so restore can rebuild data URIs)
      try {
        localStorage.setItem('lastPrediction', JSON.stringify(data));
      } catch (err) {
        console.warn('Failed to save lastPrediction to localStorage', err);
      }

    } catch (err) {
      setResultText(`❌ ${err.message}`);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
   <BrowserRouter>
      <ScrollToHash />
      <Navbar />

      <Routes>
        {/* Home: tetap satu halaman dengan anchor link */}
        <Route
          path="/"
          element={
            <div className="main-content">
              <section id="home"><HeroSection /></section>
              <section id="about"><About /></section>
              <section id="technology"><Technology /></section>
            </div>
          }
        />

        {/* Rekonstruksi: halaman terpisah yang berisi form upload & hasil */}
        <Route
          path="/rekonstruksi"
          element={
            <div className="main-content">
              <div className="container">
                <h1>Kontruksi Citra X-ray</h1>
                <h3>Masukan gambar untuk mendapatkan hasil prediksi</h3>
                <FormUpload
                  onSubmit={handleSubmit}
                  onFileChange={handleChange}
                  loading={loading}
                  onDownload={handleDownload}
                  showDownload={originalImg && enhancedImg && predictedImg}
                />

                {originalImg && enhancedImg && predictedImg ? (
                  <>
                    <ResultImages
                      originalImg={originalImg}
                      enhancedImg={enhancedImg}
                      predictedImg={predictedImg}
                    />
                    <DetectionInfo detectionInfo={detectionInfo} />
                  </>
                ) : (
                  <ImagePreview selectedFile={selectedFile} preview={preview} />
                )}

                <div id="result" style={{ color: error ? 'red' : '#28a745' }}>{resultText}</div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;