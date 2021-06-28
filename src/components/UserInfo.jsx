import React from 'react';
import '../style.css';

export const UserInfo = ({name, callback}) => {
    const handleChange = ({target: {value}}) => callback(name, value.split("\n"));

    return (
        <div className={"user-info"}>
            <label>{name}</label>
            <textarea onChange={handleChange}/>
        </div>
    )
}