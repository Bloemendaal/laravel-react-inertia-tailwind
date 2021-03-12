import * as React from 'react';

const Button: React.FunctionComponent<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = ({ className, ...props }) => {
    return (
        <button { ...props } className={ `${className || ''} bg-kelly-green hover:bg-cheerful-green disabled:cursor-default disabled:bg-gray-200 text-white disabled:text-gray-500 rounded-full px-4 py-2 font-bold transition-colors focus:outline-none` } />
    );
};

export default Button;
