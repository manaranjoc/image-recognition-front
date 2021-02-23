import {useRef, useState, useEffect, useCallback} from 'react';
import styles from './Tagger.module.css'
import {uploadImage, uploadManifest} from '../../API/ImageAPI';
import {createManifest} from './Manifest';

const Tagger = () => {

  const [currentImage, setCurrentImage] = useState(0);
  const [boundingBox, setBoundingBox] = useState({width: undefined, height: undefined});
  const [imageSize, setImageSize] = useState({height: 0, width: 0, depth: 3})
  const [manifest, setManifest] = useState([]);
  const imageContainer = useRef(null);
  const boundingBoxContainer = useRef(null);
  const imageInput = useRef(null);

  const updateCanvas = () => {
    const canvas = imageContainer.current;
    const context = canvas.getContext('2d');

    const image = new Image();
    const imageToLoad = imageInput.current.files[currentImage];

    image.onload = () => {
      setImageSize({...imageSize, height: image.height, width: image.width})
      context.clearRect(0, 0, 300, 300);
      context.drawImage(image, 0, 0, 300, 300);
      URL.revokeObjectURL(image.src);
    }

    image.src = URL.createObjectURL(imageToLoad);

  }

  const nextImage = async () => {
    const nextImage = currentImage + 1;
    const newManifest = createManifest(
      imageInput.current.files[currentImage].name,
      imageSize,
      boundingBox,
      'test'
    )
    console.log(imageInput.current.files[currentImage]);
    await uploadImage(imageInput.current.files[currentImage]);
    if (nextImage < imageInput.current.files.length) {
      setCurrentImage(nextImage);
      setManifest([...manifest, newManifest])
    } else {
      await uploadManifest([...manifest, newManifest]);
    }
  }

  useEffect(() => {
    if(imageInput.current.files.length !== 0) {
      updateCanvas();
      const context = boundingBoxContainer.current.getContext('2d');
      context.clearRect(0, 0, 300, 300)
    }
  }, [currentImage])

  const drawRectangle = (event) => {
    const rect = boundingBoxContainer.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(boundingBox.width === 0 || boundingBox.height === 0) {
      setBoundingBox({...boundingBox, width: x-boundingBox.x, height: y-boundingBox.y})
    } else {
      setBoundingBox({width: 0, height: 0, x, y})
    }

  };

  useEffect(() => {
    const context = boundingBoxContainer.current.getContext('2d');
    if( boundingBox.width !== 0 && boundingBox.height !== 0) {
      context.clearRect(0, 0, 300, 300);
      context.globalAlpha = 0.5;
      context.fillStyle = 'blue';
      context.fillRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)
      context.globalAlpha = 1;
    }
  }, [boundingBox])

  return (
    <div>
      <div className={styles.canvasContainer}>
        <canvas ref={boundingBoxContainer} width='300' height='300' className={styles.canvasBoundingBox} onClick={drawRectangle}>
          Not support for canvas tag
        </canvas>
        <canvas ref={imageContainer} width='300' height='300'>
          Not support for canvas tag
        </canvas>
      </div>

      <input ref={imageInput} accept="image/jpeg, image/png, image/jpg" type="file" name="images" multiple/>
      <button onClick={updateCanvas}>
        Start Labeling
      </button>
      <button onClick={nextImage}>
        Next Image
      </button>
    </div>
  )
}

export default Tagger;