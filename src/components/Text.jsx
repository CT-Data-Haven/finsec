import React from 'react';
// import ReactMarkdown from 'react-markdown';
import '../styles/Text.css';

const Text = (props) => {
    return (
        <div className="Text">
            <div className="text-block">{ props.text.text }</div>
        </div>
    );
};

export default Text;
