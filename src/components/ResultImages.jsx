function ResultImages({ originalImg, enhancedImg, predictedImg }) {
    return (
        <div className="result-images">
            <div>
                <h3>Original</h3>
                <img src={originalImg} alt="original" style={{maxWidth: 400, borderRadius: 16}}/>
            </div>
            <div>
                <h3>Enhance</h3>
                <img src={enhancedImg} alt="enhance" style={{maxWidth: 400, borderRadius: 16}}/>
            </div>
            <div>
                <h3>Predict</h3>
                <img src={predictedImg} alt="predict" style={{maxWidth: 400, borderRadius: 16}} />
            </div>
        </div>
    );
}

export default ResultImages;