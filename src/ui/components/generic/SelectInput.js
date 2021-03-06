import React, {useState} from 'react';
import PageMessage from './PageMessage';

function SelectInput({name, options, handler, error, defvalue, disabled}) {
    let optionsArray = [];
    (options || []).forEach((item, index) => {
        optionsArray.push(
            <option key={index} value={item}>{item}</option>
        );
    });
    optionsArray.unshift(
        <option key={-1} value="">Select {name || ""}</option>
    );
    let selectHandler = (e) => {
        if(handler && typeof handler === 'function'){
            handler(e.target.name, e.target.value);
        }else {
            window.mlog('No handler attached -> ', e.target.name, " - ", e.target.value);
        }
    }
    return (
        <div className={"form-group select-wrapper" + (error ? " error": "")}>
            <select name={name} className="form-control" required="true" onChange={selectHandler}  disabled={disabled && (disabled === true || disabled === "true")}>
                {
                    optionsArray
                }
            </select>
            {error && <PageMessage type="error" size="small" text={error}/>}
        </div>
    )
}

export default SelectInput;
