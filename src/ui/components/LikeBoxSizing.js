import React, { useState, useContext, useEffect } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import AppButton from './generic/AppButton';
import { AuthContext } from '../../store/contexts/AuthContext';
import { getUserSizes, setUserSizes } from './../../service/userProfile';
import { useNotification } from './../../store/contexts/NotificationProvider';

function LikeBoxSlider({label, min=0, max=100, onChange, slideIn, slideOut}) {
    const [value, setValue] = useState(0)
    //const [displayValue, setDisplayValue] = useState(0)
    const [unit, setUnit] = useState('cm') 

    let displayValue = unit == 'cm' ? value : Number(value * 0.393701).toFixed(1)
    const calculateValue = (val) => {
        let res = val;
        /* if(val === 0){res = min;}
        else if(val === 100){res = max;}
        else {
            res = Math.round((val/100) * (max-min)) + min;
        } */
        if(res !== value) {
            setValue(res)
            if(typeof onChange === 'function'){
                onChange(res)
            }
        }
    }
    const changeUnit = (new_unit) => {
        if(new_unit === unit){return}
        setUnit(new_unit)
    }
    return (
        <div className={"like-box-slider-wrapper d-flex flex-column"}>
            <div className="like-box-slider-text-container d-flex justify-content-between align-items-center">
                <div className="like-box-slider-label align-items-center">{label}</div>
                <div className="like-box-slider-unit-container d-inline-flex align-items-center">
                    <div className="like-box-slider-value d-inline-flex mr-2">{displayValue === 0? "" : displayValue }</div>
                    <div className="like-box-slider-unit-btns d-inline-flex">
                        <button type="button" className={"like-box-unit-btn btn-left" + (unit === 'cm' ? ' active': '')} onClick={() => changeUnit('cm')}>cm</button>
                        <button type="button" className={"like-box-unit-btn btn-right" + (unit === 'in' ? ' active': '')} onClick={() => changeUnit('in')}>inch</button>
                    </div>
                </div>
            </div>
            
            <div className="like-box-slider-container">
                <RangeSlider
                    value={value}
                    onChange={e => calculateValue(e.target.value)}
                    tooltip='off'
                    min={min}
                    max={max}
                    variant="dark"
                />
            </div>
            
        </div>
    )
}

let SIZING = {}
export default function LikeBoxSizing({slideIn, slideOut, onChange, onComplete, skip=false}) {
    const [ value, setValue ] = useState(25);
    const {currentUser} = useContext(AuthContext);

    const dispatch = useNotification();

    const onInputChange = (name, val) => {
        window.mlog(name, val);
        if(val > 0){
            SIZING[name] = val;
        }
    }
    useEffect(()=>{
        if(!currentUser){return}
        try{
            (async ()=>{
                let res = await getUserSizes(currentUser.email);
                window.mlog('Fetched Sizes', res);
            })()
        }catch(err){
            console.error('LikeBoxSizing', err);
        }
    }, [currentUser])
    const submit = async () => {
        if(currentUser){
            try {
                let res = await setUserSizes(currentUser.email, SIZING);
                dispatch({
                    type: 'success',
                    message: 'Updated your sizes!'
                }) 
            }catch(err) {
                console.error('LikeBoxSizing:submit', err);
                dispatch({
                    type: 'error',
                    message: 'Uh Oh! Something went wrong!'
                }) 
            }finally{
                if(typeof onComplete === 'function'){
                    onComplete();
                }
            }
        }
    }
    return (
        <div className={"like-box-preference container" + (!slideIn && !slideOut ? " slide-hold" : "") + (slideOut ? " slide-out" : "") + (slideIn ? " slide-in" : "")}>
            <h2 className="align-text-center pl-3 pr-3 mt-5 mb-5">Add your sizes so that we can ensure that everything you order will fit you perfectly</h2>
            <LikeBoxSlider
                min={0}
                max={70}
                label="Head circumference"
                onChange={(val) => onInputChange('head', val)}
            />
            <LikeBoxSlider
                min={0}
                max={75}
                label="Neck"
                onChange={(val) => onInputChange('neck', val)}
            />
            <LikeBoxSlider
                min={0}
                max={150}
                label="Chest"
                onChange={(val) => onInputChange('chest', val)}
            />
            <LikeBoxSlider
                min={0}
                max={200}
                label="Waist"
                onChange={(val) => onInputChange('waist', val)}
            />
            <LikeBoxSlider
                min={0}
                max={50}
                label="Shoe size"
                onChange={(val) => onInputChange('shoe', val)}
            />

            <div className="row m-0 mt-5 mb-5 ">
                <div className={skip? "col-6" : "col-12"}>
                    <AppButton label="Submit" className="w-100" onClick={submit}/>
                </div>
                {skip &&<div className="col-6">
                    <AppButton label="Skip" className="btn-white border-0 border-radius-0 w-100" onClick={onComplete}/>
                </div>}
            </div>


            
            
        </div>
    )
}
