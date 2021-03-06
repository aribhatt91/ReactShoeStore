import React, { useState } from 'react';
import AppImage from './generic/AppImage';

function ProductHeroGallery({images, productName }) {
    const [selected, setSelected] = useState(0);
    return (
        <div className="product-thumb-gallery col-lg-6 d-md-flex flex-md-nowrap float-left position-relative">
            
            <div className="product-image-thumbnails clearfix col-md-2 d-flex flex-column justify-content-start float-left p-2">
                {
                    (images || []).map((item, index) => (
                        <div key={index} className={"thumb-image square mb-md-2" + (selected === index ? " selected" : "")} onClick={() => {setSelected(index)}}>
                            <AppImage src={(decodeURI(item) || "").trim()} alt={productName} title={productName}/>
                        </div>
                    ))
                }
            </div>
            <div className="product-zoomed-image col-md-10 float-left p-0">
                    {
                        (images || []).map((item, index) => (
                            <AppImage key={index} className={"m-2 w-100" + (selected === index ? " selected" : " position-absolute")} src={(decodeURI(item) || "").trim()} alt={productName} title={productName}/>
                        ))
                    }
                    <AppImage className="w-100" src={(decodeURI(images[0]) || "").trim()} alt={productName} aria-label={productName}/>
            </div>
            
        </div>
    )
}

export default ProductHeroGallery;