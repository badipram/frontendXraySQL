function FormUpload({ onSubmit, onFileChange, loading, onDownload, showDownload }) {
  return (
    <form id="rekonstruksi" onSubmit={onSubmit}>
      <input type="file" accept="image/*" required onChange={onFileChange} />
      <br />

      <div className="buttons">
        {loading ? (
        <button type="button" disabled>
          <i className="fa-solid fa-spinner fa-spin"></i> Processing
        </button>
      ) : (
        <button type="submit">
          <i className="fa-solid fa-magnifying-glass"></i> Process
        </button>
      )}
      {showDownload && !loading && (
        <button type="button" onClick={onDownload}>
          <i className="fa-solid fa-download"></i> Unduh Hasil
        </button>
      )}
      </div>
    </form>
  );
}

export default FormUpload;
