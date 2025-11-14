export const getFilePreview = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });

export const resetPredictionState = (setters) => {
  const { setOriginalImg, setEnhancedImg, setPredictedImg, setResultText, setError } = setters;
  setOriginalImg(null);
  setEnhancedImg(null);
  setPredictedImg(null);
  setResultText('');
  setError(false);
};