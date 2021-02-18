import React, { Component } from 'react';

export interface TooltipProps {
    content: string;
    direction?: 'top-center' | 'top-left' | 'top-right' |
    'left-center' | 'left-top' | 'left-bottom' |
    'bottom-center' | 'bottom-left' | 'bottom-right' |
    'right-center' | 'right-top' | 'right-bottom'
}

export interface TooltipState {

}

class Tooltip extends Component<TooltipProps & React.HTMLAttributes<HTMLDivElement>, TooltipState> {

    render() {
        const { content, children, className, direction, ...rest } = this.props;

        return (
            <div className={`group relative ${className || ''}`} {...rest}>
                {children}
                <div className="w-max text-sm font-medium shadow-md z-40 mt-1 text-white bg-gray-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity p-2 absolute rounded">
                    {content}
                </div>
            </div>
        );
    }
}

export default Tooltip;
