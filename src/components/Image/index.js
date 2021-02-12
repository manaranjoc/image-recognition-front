import React, {useEffect, useState, useRef} from "react";
import styles from './Image.module.css'

const Image = ({image, labels}) => {

    const width = 500;
    const height = 500;

    const imageContainer = useRef();
    const [boundingBoxes, setBoundingBoxes] = useState([]);

    useEffect(() => {
        if (image !== undefined) {
            const reader = new FileReader();

            reader.onload = (event) => {
                imageContainer.current.src = reader.result;
            }
            reader.readAsDataURL(image);
        }
    }, [image])

    useEffect(() => {
        if (labels !== undefined) {
            setBoundingBoxes(labels.filter((label) => label.Instances.length));
        }
    }, [labels])

    return (
        <div className={styles.imageWrapper}>
            <img ref={imageContainer} src="" alt="" width={width} height={height}/>
            <div className="boundingBoxes">
                {
                    boundingBoxes.map((label) => {
                        const boundingBoxesInstances = label.Instances;

                        return boundingBoxesInstances.map(({BoundingBox}) => {
                            const position = {
                                top: BoundingBox.Top * height,
                                left: BoundingBox.Left * width,
                                width: BoundingBox.Width * width,
                                height: BoundingBox.Height * height,
                                border: `2px #${Math.floor(Math.random()*16777215).toString(16)} solid`,
                            }

                            return (<div key={label.Name} className={styles.boundingBox} style={position}></div>)
                        })

                    })
                }
            </div>
        </div>
    )
}

export default Image;