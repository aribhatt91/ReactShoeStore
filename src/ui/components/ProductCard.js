import React, { useContext, useState } from 'react';
import AppButton from './generic/AppButton';
import { AuthContext } from './../../store/contexts/AuthContext';
import { addItemToWishList } from '../../service/wishlistMethods';
import { useNotification } from './../../store/contexts/NotificationProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { formatPrice } from '../../service/helper';
import WishListButton from './WishListButton';

export function ProductCardPlaceholder () {
    return (
        <div className="product-card-placeholder slide-up row mr-0 ml-0 mt-5 mb-5">
            <div className="card-thumb-wrapper-placeholder p-0 col-xs-12 col-md-4 col-lg-3">
            </div>
            <div className="card-text-wrapper col-xs-12 col-md-4 col-lg-5 p-4 pt-md-0 pb-md-0 d-flex flex-column justify-content-between align-center">
                <div className="product-description-placeholder w-100">
                    <div className="card-product-brand-placeholder w-100"></div>
                    <div className="card-product-name-placeholder w-100 mt-4"></div>
                    <div className="card-product-price-placeholder w-100 mt-4"></div>
                </div>
                <div className="action-buttons-placeholder w-100">
                    <div className="button-placeholder w-100"></div>
                    <div className="button-placeholder w-100 mt-2"></div>
                </div>
            </div>
            <div className="card-desc-wrapper-placeholder col-xs-12 col-md-4 col-lg-4 p-4 pt-md-0 pb-md-0">
                <div className="line w-100"></div>
                <div className="line w-100 mt-2"></div>
                <div className="line w-100 mt-2"></div>
            </div>
        </div>
    )
}
const ProductCard = ({product}) => {
    const {currentUser} = useContext(AuthContext);
    const [ctaLoading, setCtaLoading] = useState(false);
    const dispatch = useNotification();
    const addToWishList = async () => {
        if(currentUser){
            try{
                setCtaLoading(true);
                let res = await addItemToWishList(currentUser.email, product.sku, product);
                window.mlog('ProductCard:addToWishList', res);
                dispatch(
                    {
                        type: 'success',
                        message: 'Item added to your wishlist!',
                        title: 'Success!'
                    }
                )
                
                
            }catch(err){
                window.mlog('addToWishList', err);
                if(err.msg){
                    dispatch(
                        {
                            type: 'error',
                            message: err.msg,
                            title: 'Error!'
                        }
                    )
                }
            }finally {
                setCtaLoading(false);
            }
          
        }else {
            window.mlog('User not authenticated');
            dispatch(
                {
                    type: 'error',
                    message: 'You need to be signed in!',
                    title: 'Error!'
                }
            )
        }
    }

    return (
        <div className="product-card row mr-0 ml-0 mt-5 mb-5" key={product.sku}>
            <div className="card-thumb-wrapper p-0 col-xs-12 col-md-4 col-lg-3">
{/*                 <AppImage className="card-thumb" src={(decodeURI(props.img) || "").trim()} alt={props.title} aria-label={props.title} />
 */}                <LazyLoadImage
                    alt={product.name}
                    aria-label={product.name}
                    effect="opacity"
                    src={(decodeURI(product.thumbnail) || "").trim()}
                    className="card-thumb w-100 h-100" />
            </div>
            <div className="card-text-wrapper col-xs-12 col-md-4 col-lg-5 p-4 pt-md-0 pb-md-0 d-flex flex-column justify-content-between align-center">
                <div className="product-description">
                    <h3 className="card-product-brand text-center">{product.brand}</h3>
                    <h4 className="card-product-name text-center">{product.name}</h4>
                    <div className="card-product-price text-center">
                        <span>{ formatPrice(product.price)}</span><span className="text-uppercase ml-1">{product.currency}</span>
                    </div>
                </div>
                <div className="action-buttons w-100">
                    <AppButton href={"/product/" + product.sku} target="_blank" label="View product" className="w-100 btn-grey"/>
                    <WishListButton className={"btn-white w-100 mt-2"} product={product} />
                </div>
            </div>
            <div className="card-desc-wrapper col-xs-12 col-md-4 col-lg-4 p-4 pt-md-0 pb-md-0">
                {
                    (product.description || "")
                    //.substr(0, 100).concat("...")
                }
            </div>
        </div>
    );
}


export default ProductCard;