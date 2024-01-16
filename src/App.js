import React, { useState } from 'react';
import './App.css';
import 'tachyons'; // Import Tachyons CSS

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [clarifaiInfo, setClarifaiInfo] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();

    // Check if the input is a valid image URL
    const isImageUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(inputValue);

    if (isImageUrl) {
      setImageUrl(inputValue);
      setShowWarning(false);

      const PAT = '5e07f757b4af43f0a2ca45d8858efcd5';
   
      const USER_ID = 'clarifai';       
      const APP_ID = 'main';
   
      const MODEL_ID = 'general-image-recognition';
      // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';    
      const IMAGE_URL = inputValue;


      const raw = JSON.stringify({
          "user_app_id": {
              "user_id": USER_ID,
              "app_id": APP_ID
          },
          "inputs": [
              {
                  "data": {
                      "image": {
                          "url": IMAGE_URL
                      }
                  }
              }
          ]
      });

      const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
      };

      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result =>
        {
          let data = JSON.parse(result)
          setClarifaiInfo(data.outputs[0].data.concepts);
        })
        .catch(error => console.log('error', error));
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
            <img src={imageUrl} alt="Entered" className="br3 ba b--black-10 w-50 h-50" />
          </div>
        )}

        {clarifaiInfo && (
          <div className="pa2 bg-near-white black br3 shadow-5">
            {/* Display Clarifai API information */}
            {/* Adjust this section based on the actual response format */}
            <p className="f4">Concepts detected:</p>
            <ul className="list pl0">
              {clarifaiInfo.map((concept) => (
                <li key={concept.id} className="f5 lh-copy"> "Concept:  "  {concept.name}  --- "Surity : " {(concept.value * 100).toFixed(2)}</li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
