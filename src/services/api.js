export const predictImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  // const response = await fetch('https://backendxray-production.up.railway.app/predict', {
  //   method: 'POST',
  //   body: formData,
  // });

  const response = await fetch('https://backendsql-production.up.railway.app/predict', {
    method: 'POST',
    body: formData,
  });

  // const response = await fetch('http://127.0.0.1:5050/predict', {
  //   method: 'POST',
  //   body: formData,
  // });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Prediction failed');
  }

  return await response.json();
};