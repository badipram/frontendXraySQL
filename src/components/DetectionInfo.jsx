function DetectionInfo ({ detectionInfo}) {
    return (
        <div style={{marginTop: 20}}>
            <h3>Keterangan Deteksi</h3>
            <p>Jumlah Label Terdeteksi: <b>{detectionInfo.length}</b></p>
            {detectionInfo.length > 0 && (
                <table border="1" cellPadding="4">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Confidence</th>
                            <th>Koordinat [xmin, ymin, xmax, ymax]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detectionInfo.map((det, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{(det.confidence * 100).toFixed(2)}%</td>
                                <td>{det.bbox.map(x => x.toFixed(1)).join(',')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default DetectionInfo;