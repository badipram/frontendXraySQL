import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <>
        <section id="home" className="hero-section">
            <div className="hero-text">
                <h1>Konstruksi dan Deteksi Citra <span className="blue">X-ray </span> Berbasis <span className="red">AI</span></h1>
                <h3>Sistem cerdas berbasis Computer Vision untuk membantu identifikasi dan analisis citra X-ray secara akurat dan efisien. Mendukung diagnosa medis dengan visualisasi yang lebih jelas dan tersrtuktur</h3>
                <Link to="/rekonstruksi" className="btn">Unggah Citra Xray</Link>
            </div>
            <div className="hero-image">
                <img src="/CT scan-pana.png" alt="ilustration" />
            </div>
        </section>
        </>
        
    )
}

export default HeroSection;