function ImagePreview({ selectedFile, preview}) {
    return (
        <div className="preview-card">
            {selectedFile && preview && (
                <img src={preview} style={{ maxWidth: 300, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0,0.7)'}} />
            )}
            <div style={{textAlign: 'center', marginTop: 8, color: '#555', fontWeight: 500}}>
                Preview will appear here
            </div>
        </div>
    );
}

export default ImagePreview;