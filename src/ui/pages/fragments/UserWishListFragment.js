import React, { useState, useEffect, useContext } from 'react';
import { fetchWishList, removeItemFromWishList } from '../../../service/wishlistMethods';
import { CURRENCY } from './../../../service/constants';
import AppButton from '../../components/generic/AppButton';
import AppImage from './../../components/generic/AppImage';
import { useNotification } from './../../../store/contexts/NotificationProvider';
import TrashIcon from '../../components/svg-components/TrashIcon';

function WishListInstancePlaceholder() {
    return (
        <div className="wish-list-instance-container wish-list-instance-container-placeholder mb-3 position-relative">
            <div className="wish-list-instance-thumb">
            </div>
            <div className="wish-list-instance-text pt-2 pb-2">
                <div className="wish-list-instance-price-placeholder w-100"></div>
                <div className="wish-list-instance-name-placeholder w-100"></div>
                <div className="wish-list-cta-placeholder w-100 mt-1"></div>
            </div>
        </div>
    )
}
function WishListInstance({instance, removeItem}){
    const [showDeletePop, setShowDeletePop] = useState(false);
    const sku = instance.sku, 
    deletePopAlert = (e) => {
        //e.stopImmediatePropagation();
        setShowDeletePop(true);
    },
    deleteWishListAction = (e) => {
        setShowDeletePop(false);
        if(removeItem && typeof removeItem === 'function'){
            removeItem(sku);
        }
    }

    useEffect(()=>{
        window.mlog('adding event listener..')
        window.addEventListener('click', (e)=>{
            //if(showDeletePop){
                setShowDeletePop(false);
            //}
        })
    }, [])

    return (
        <div className="wish-list-instance-container mb-3 position-relative">
            <a href={instance.url} className="wish-list-instance-thumb">
                <AppImage src={instance.thumbnail}/>
            </a>
            <div className="wish-list-instance-text pt-2 pb-2">
                <div className="wish-list-instance-price">
                    <span className="currency text-uppercase">{instance.currency}</span>
                    <span className="wish-list-instance-sale-price">
                        {instance.price}
                    </span>
                </div>
                <div className="wish-list-instance-name">
                    {instance.name}
                </div>{/* 
                <div className="wish-list-instance-brand">
                    {instance.brand}
                </div> */}
                <div className="wish-list-cta w-100 mt-1">
                    <AppButton className="w-100 sm" href={`/product/${instance.sku}`} label="View product" />
                </div>
            </div>
            <div className="wish-list-instance-remove-wrapper tooltip-wrapper d-flex flex-column align-items-end" onClick={(e)=>{e.stopPropagation()}}>
                <span className="action-icon" onClick={deletePopAlert}>
                    <TrashIcon />
                </span>
                <div className={"action-message-tooltip p-3" + (showDeletePop ? "" : " d-none")}>
                    <p className="mb-2">Are you sure you want to remove this item?</p>
                    <div className="d-flex align-items-end">
                        <div className="d-inline-block mr-2">
                            <AppButton 
                                label="Cancel" 
                                className="w-100 btn-white sm border-0" 
                                onClick={(e) => {setShowDeletePop(false)}}
                                />
                        </div>
                        <div className="d-inline-block">
                            <AppButton 
                                label="Remove" 
                                className="w-100 sm border-0 border-radius-0" 
                                onClick={deleteWishListAction}
                                />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
function UserWishListFragment({currentUser}){
    const [wishList, setWishList] = useState([]),
    [pending, setPending] = useState(false);    
    const dispatch = useNotification();
    useEffect(() => {
        if(currentUser){
            setPending(true);
            fetchWishList(currentUser.email).then(res => {
                window.mlog('UserWishListFragment', res); 
                setWishList(res); 
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                setPending(false);
            })
        }else {
        }
    }, [currentUser])
    const removeItem = async (sku) => {
        if(!currentUser){
            return;
        }
        try {
            setPending(true);
            let rem = await removeItemFromWishList(currentUser.email, sku);
            window.mlog(rem);
            let res = await fetchWishList(currentUser.email);
            window.mlog('updated wishlist', res);
            if(rem.type === 'success'){
                dispatch({
                    type: rem.type,
                    message: rem.msg,
                    title: 'Success!'
                })
            }
            if(res){
                setWishList(res);
            }
            
        }catch(err) {
            console.error(err)
            if(err.msg){
                dispatch({
                    type: err.type,
                    message: err.msg,
                    title: 'Error'
                })
            }
            
        }finally {
            setPending(false);
        }
    }
    window.mlog('wishList', wishList);
    return (
        <div className={"wish-list-section mt-5 mb-5"}>
            <h1 className="text-center mb-5 text-uppercase">Wishlist</h1>
            <div className="wish-list-container d-flex flex-wrap">
                {
                    wishList.map((item, index) => 
                        <div className="d-flex justify-content-center col-md-4 p-0">
                            <WishListInstance
                                key={index}
                                instance={item}
                                removeItem={removeItem}
                            />
                        </div>
                    )
                }
                {
                    (!pending && wishList.length === 0) && <div></div>
                }
                {
                    pending && <React.Fragment>
                        <WishListInstancePlaceholder/>
                        <WishListInstancePlaceholder/>
                        <WishListInstancePlaceholder/>
                        <WishListInstancePlaceholder/>
                        <WishListInstancePlaceholder/>
                        <WishListInstancePlaceholder/>
                    </React.Fragment>
                }
            </div>
        </div>
    )

}

export default UserWishListFragment;