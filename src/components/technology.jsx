import { technologyItems } from "../assets/dummy"

const Technology = () => {
    return (
        <div id="technology" className="technology-container">
            <div className="technology-title">
                <h1>Teknologi yang Digunakan</h1>
                <h3>Stack teknologi modern dan terpercaya untuk performa optimal dalam analisis dan rekonstruksi citra medis.</h3>
            </div>
            <div className="technology-card">
                {technologyItems.map((item, index) => (
                    <div className="technology-card-item" key={index}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Technology;