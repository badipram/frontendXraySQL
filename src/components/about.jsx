import { aboutItems } from '../assets/dummy.js';

const About  = () => {
    return (
        <div id="about" className="about-container">
            <div className="about-title">
                <h1>Tentang RekoMed</h1>
                <h3>Sistem konstruksi dan deteksi citra X-ray <br /> berbasis kecerdasan buatan yang membantu proses identifikasi terhadap anomali pada citra medis</h3>
            </div>
            <div className="about-card">
                {aboutItems.map((item, index) => (
                    <div className="about-card-item" key={index}>
                        <div className="about-card-header">
                            <i className={item.iconClass}></i>
                            <h2>{item.title}</h2>
                        </div>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default About;