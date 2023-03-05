import React from 'react';

const ResponseText = function(props){
    if(props.text){
        return (
            <div>
                <p>{props.text}</p>
            </div>
        );

    }
}

export default ResponseText;