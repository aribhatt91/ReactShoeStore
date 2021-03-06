import { db } from '../firebase.js';

/* 
Wishlist Schema
{
    id,
    name,
    user_id,
    items: [
        {
            id,
            date_added
        }
    ]
} 
*/
const collection = db.collection('wishlists');

export const getWishlistQuery = (email) => {
    return collection.where("user_id", "==", email).get();
}

export const updateWishlistQuery = (docId, update) => {
    return collection.doc(docId).update(update);
}

export const isItemInWishList = async (email, sku) => {
    try{
        let queries = await getWishlistQuery(email);
        if(queries.size > 0){
            let isPresent = false;


            queries.forEach( doc => {
                window.mlog('WishList -> ', doc.id, doc.data());
                let data = doc.data();
                data = data || {};
                (data.items || []).forEach( item => {
                    if(item.sku === sku){
                        isPresent = true;
                    }
                })
            });

            return new Promise(resolve => resolve(isPresent));

        }
    }catch(err){
        console.error(err);
    }
    return new Promise(resolve => resolve(false));

}

export const getUserWishList = async (email) => {
    let res = [];
    try {
        if(email){
            let queries = await getWishlistQuery(email),
            items = [];
            if(queries.size > 0){
                queries.forEach( doc => {
                    window.mlog('WishList -> ', doc.id, doc.data());
                    let data = doc.data();
                    data = data || {};
                    items = items.concat((data.items || []));
                });
                res = new Promise(resolve => resolve(items));
            }
        }else {
            throw new Error('No email parameter found');
        }
    }catch(err){
        res = new Promise((resolve, reject) => reject(err));
    }
    return res;
}
export const createWishList = async (email, name="My Wishlist", products=[]) => {
    let res = null;
        try {
            if(email){
                let queries = await getWishlistQuery(email);
                if(queries.size <= 0){
                    let wlist = {}, items = [];
                    wlist.user_id = email;
                    products.forEach(product => {
                        if(!product.sku){
                            throw new Error('Invalid product');
                        }
                        items.push({
                            sku: product.sku, 
                            thumbnail: product.thumbnail,
                            name: product.name,
                            link: product.link,
                            price: product.price,
                            currency: product.currency,
                            date_added: (new Date()).getTime()
                        });
                    })
                    wlist.items = items;
                    try {
                        let docRef = await collection.add(wlist),
                        doc = await collection.doc(docRef.id).get();
                        doc = doc || {};
                        window.mlog('createWishList', docRef.id, doc.data());
                        res = new Promise(resolve => resolve({
                            type: 'success',
                            items:(doc.data().items || [])
                        })) //(data.items || []).map(item => item.sku)
                    }catch(err){
                        console.error(err);
                        res = new Promise(resolve => resolve([]))
                    }
                }else {
                    let data = {};
                    data.type = 'error';
                    data.msg = 'Wishlist is already present';
                    res = new Promise(resolve => resolve(data));
                }
            }else {
                throw new Error('No email parameter present');
            }
        }catch(err){
            res = new Promise((resolve, reject) => reject(err));
        }
    return res;
}

export const addToWishList = async (email, sku, product) => {
    let res = null;
    window.mlog('addToWishList called', product); 
    if(email){
        try{
            let queries = await getWishlistQuery(email);
            if(queries.size <= 0){
                let data = await createWishList(email, "", [product]);
                
                window.mlog('addToWishList: createWishList', data); 
                res = new Promise(resolve => resolve(data));
            }else if(queries.size === 1){
                window.mlog('queries', queries.docs[0].id);
                let doc = queries.docs[0],
                docId = doc.id;
                window.mlog(doc.id, " => ", doc.data());
                let products = doc.data().items || [], isPresent = false;
                
                /* Check if product is present */
                for (let i = 0; i < products.length; i++) {
                    if(products[i].sku === product.sku){
                        isPresent = true;
                        break;
                    }
                }
                if(isPresent){
                    let data = {};
                    data.type = 'error';
                    data.msg = 'Product is already present in your wish list';
                    window.mlog('Product already present');
                    res = new Promise((resolve, reject) => reject(data))
                }else {/* If not add it and update */
                    products.push({
                        sku: product.sku, 
                        thumbnail: product.thumbnail,
                        name: product.name,
                        link: product.link,
                        price: product.price,
                        currency: product.currency,
                        date_added: (new Date()).getTime()});
                    //let updateQuery = await updateWishlistQuery(doc.id, {'items': products});
                    
                    let docRef = await updateWishlistQuery(doc.id, {'items': products});
                    /* doc = await collection.doc(docId).get();
                    doc = doc || {}; */
                    //window.mlog('addToWishList', docId, doc.data());
                    res = new Promise(resolve => resolve({
                        type: 'success',
                        msg: 'Item added to your wishlist!'
                    }))
                }
            }
        }
        catch(err){
            /* let data = {};
            data.type = 'error';
            data.msg = 'Product is already present in your wish list'; */
            //console.error(err);
            res = new Promise((resolve, reject) => reject({
                type: 'error',
                msg: 'An error occurred!',
                error: err
            }))
        }
        return res; 
    }
}

export const removeFromWishList = async (email, sku) => {
    let res = null;
    if(email){
        try{
            let queries = await getWishlistQuery(email);
            if(queries.size <= 0){
                res = createWishList(email, "", [sku]);
            }else if(queries.size === 1){
                window.mlog('queries', queries.docs[0].id);
                let doc = queries.docs[0],
                docId = doc.id;
                window.mlog(doc.id, " => ", doc.data());
                let products = doc.data().items || [], isPresent = false, index = -1;
                
                /* Check if product is present */
                for (let i = 0; i < products.length; i++) {
                    if(products[i].sku === sku){
                        isPresent = true;
                        index = i;
                        break;
                    }
                }
                if(isPresent && index > -1){
                    products.splice(index, 1);                        
                    let docRef = await updateWishlistQuery(doc.id, {'items': products});
                    /* doc = await collection.doc(docId).get();
                    doc = doc || {}; */
                    //window.mlog('removeFromWishList', docId, doc.data());
                    res = new Promise(resolve => resolve({
                        type: 'success',
                        msg: 'Item removed from your Wishlist!'
                    }))
                }else {/* If not add it and update */
                    let data = {};
                    data.type = 'error';
                    data.msg = 'Item is not present in your wish list';
                    res = new Promise((resolve, reject) => reject(data))
                }
            }
        }
        catch(err){
            /* let data = {};
            data.type = 'error';
            data.msg = 'Product is already present in your wish list'; */
            let data = {};
            data.type = 'error';
            data.msg = 'An error occurred!';
            res = new Promise((resolve, reject) => reject(data))
        }
        return res; 
    }
}
