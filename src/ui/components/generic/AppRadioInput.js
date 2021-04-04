import React from 'react'
import { useFormikContext } from 'formik';

export default function AppRadioInput({name, options, onChange, ...rest}) {
    const {setFieldTouched, handleChange, errors, touched, initialValues, values} = useFormikContext();
    const postChange = (e) => {
        console.log(name, e.target.value);
    }
    return (
        <div className="app-radio-input-options d-flex">
            {
                (options || []).map((item, index) => (
                        <div className="app-radio-input-wrapper mr-2" key={index}>
                            <input {...rest} 
                                className="app-radio-input" 
                                type="radio" 
                                onFocus={() => {setFieldTouched(true)}} 
                                onChange={handleChange} 
                                name={name} 
                                value={item} />
                            <span className="text-capitalize">{item}</span>
                        </div>
                    )
                )
            }
            
            
        </div>
    )
}
