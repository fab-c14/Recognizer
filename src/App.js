import React, { useState } from 'react';
import './App.css';
import 'tachyons'; // Import Tachyons CSS

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [clarifaiInfo, setClarifaiInfo] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if the input is a valid image URL
    const isImageUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(inputValue);

    if (isImageUrl) {
      setImageUrl(inputValue);
      setShowWarning(false);

      // Add your Clarifai API logic here
      // For example, you can use fetch or axios to make a request to the Clarifai API
      // Replace 'YOUR_CLARIFAI_API_KEY' with your actual Clarifai API key
      const clarifaiApiKey = '5e07f757b4af43f0a2ca45d8858efcd5';
      const clarifaiEndpoint = 'https://api.clarifai.com/v2/models/your-model-id/predict'; // Replace 'your-model-id' with the actual model ID

      try {
        const response = await fetch(clarifaiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clarifaiApiKey}`,
          },
          body: JSON.stringify({
            inputs: [
              {
                data: {
                  image: {
                    url: inputValue,
                  },
                },
              },
            ],
          }),
        });

        const data = await response.json();
        setClarifaiInfo(data);

      } catch (error) {
        console.error('Error calling Clarifai API:', error);
      }
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onSubmit} className="flex items-center justify-between">
          <div className="pa2 w-70">
            <input
              className={`pa3 ba b--green bg-lightest-blue ${showWarning ? 'b--red' : ''}`}
              type="text"
              placeholder="Enter image URL..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          {showWarning && (
            <div className="pa2">
              <p className="dark-red">Please enter a valid image URL.</p>
            </div>
          )}
          <div className="pa2 w-20">
            <button className="f4 link dim br3 ba bw2 ph3 pv2 mb2 dib white bg-dark-green" type="submit">
              Submit
            </button>
          </div>
        </form>

        {imageUrl && (
          <div className="pa2">
            <img src={imageUrl} alt="Entered" className="br3 ba b--black-10" />
          </div>
        )}

        {clarifaiInfo && (
          <div className="pa2">
            {/* Display Clarifai API information */}
            {/* Adjust this section based on the actual response format */}
            <p>Concepts detected:</p>
            <ul>
              {clarifaiInfo.outputs[0].data.concepts.map((concept) => (
                <li key={concept.id}>{concept.name} - {concept.value.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
