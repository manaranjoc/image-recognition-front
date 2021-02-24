import styles from './App.module.css';
import React, {useState} from "react";
import Form from "./components/Form";
import Image from "./components/Image"
import {BrowserRouter, Route} from 'react-router-dom';
import Tagger from './components/Tagger';
import Navbar from './components/Navbar'

function App() {
  const [image, setImage] = useState();
  const [imageLabels, setImageLabels] = useState();

  return (
    <BrowserRouter>
      <Navbar/>
      <div className={styles.container}>
        <Route path='/' exact>
          <Image
            image={image}
            labels={imageLabels}
          />
          <Form
            imageLabels={imageLabels}
            setImage={setImage}
            setImageLabels={setImageLabels}
          />
        </Route>
        <Route path='/bounding-box'>
          <Tagger/>
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
