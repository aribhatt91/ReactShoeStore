import { fetchStateError, fetchStateSuccess, fetchStatePending } from './../actions/index';
import PRODUCTS from './products';
function simulateNetworkRequest() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}
/*
filter = {
    category: (MEN, WOMEN, KIDS, TRENDING),
    type: (SNEAKERS, CASUAL, FLIP-FLOP etc),
    sortBy: (),
    brand: (),a
    priceRange: (),
    brand: (),
    search: ()
}
*/
function fetchItems(filter) {
    return dispatch => {
        dispatch(fetchStatePending());
        simulateNetworkRequest()
        .then(() => {
            var products = PRODUCTS;
            console.log(products, filter);
            // Filter by category
            if(filter && filter.category){
                products = products.filter((product) => {return (product.category.toLowerCase()).split(', ').indexOf(filter.category.toLowerCase()) > -1});
            }
            dispatch(fetchStateSuccess(products));
            return products;
        })
        .catch(error => {
            dispatch(fetchStateError(error));
        })
    }
}

export default fetchItems;