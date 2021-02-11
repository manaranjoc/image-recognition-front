import React, {useEffect, useState, useRef} from "react";

const Image = ({image, labels}) => {

    const imageContainer = useRef();

    useEffect(() => {
        if (image !== undefined) {
            const reader = new FileReader();

            reader.onload = (event) => {
                imageContainer.current.src = reader.result;
            }
            reader.readAsDataURL(image);
        }
    }, [image])

    return (
        <div className="imageWrapper">
            <img ref={imageContainer} src="" alt=""/>
            <div className="boundingBoxes">

            </div>
        </div>
    )
}

export default Image;