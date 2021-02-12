import React, {useEffect, useState, useRef} from "react";
import {contrast, randomColor} from "../../shared/utils/color";
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
            <img ref={imageContainer} src="" alt="" className={styles.image}/>
            <div className="boundingBoxes">
                {
                    boundingBoxes.map((label) => {
                        const boundingBoxesInstances = label.Instances;

                        const colorlabel = randomColor();

                        return boundingBoxesInstances.map(({BoundingBox}, index) => {

                            const position = {
                                top: `${BoundingBox.Top*100}%`,
                                left: `${BoundingBox.Left*100}%`,
                                width: `${BoundingBox.Width*100}%`,
                                height: `${BoundingBox.Height*100}%`,
                                border: `2.5px #${colorlabel} solid`,
                            }

                            const tooltipStyle = {
                                color: contrast(colorlabel),
                                '--background-color': `#${colorlabel}`,
                            }

                            return (
                                <div key={`${label.Name}-${index}`} className={styles.boundingBox} style={position}>
                                    <div className={styles.tooltip} style={tooltipStyle}>
                                        {label.Name} <br/>
                                        {label.Confidence.toFixed(2)}%
                                    </div>
                                </div>
                            )
                        })

                    })
                }
            </div>
        </div>
    )
}

export default Image;