import * as React from 'react';
import Spinner from './Spinner';

export type ButtonProps = {
    submitting?: boolean | React.ReactNode;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const Button: React.FunctionComponent<ButtonProps> = ({ className, children, disabled, submitting, ...props }) => {
    return (
        <button
            { ...props }
            disabled={ !!submitting || disabled }
            className={ `${className || ''} bg-kelly-green hover:bg-cheerful-green disabled:cursor-default disabled:bg-gray-200 text-white disabled:text-gray-500 rounded-full px-4 py-2 font-bold transition-colors focus:outline-none inline-flex` }>
            {
                submitting ? (
                    <>
                        <Spinner className={ submitting === true ? '' : 'mr-3' } />
                        { submitting === true ? '' : submitting }
                    </>
                ) : children
            }
        </button>
    );
};

export default Button;
