import React from 'react'

function Image({ props }) {
    return (
        <img className="postImage" src={props.imageFile} />
    )
}

export default Image