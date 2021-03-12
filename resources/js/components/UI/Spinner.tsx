import * as React from 'react';
import '../../../css/UI/spinner.css';

export interface SpinnerProps {
    size?: number;
    className?: string;
    circleClass?: string;
    style?: React.CSSProperties;
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ size, className, circleClass, style }) => {
    size = size || 24;

    return (
        <div className={ `spinner ${className || ''}` } style={{ height: style?.height || size, width: style?.width || size, ...style }}>
            <svg viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" className={ `stroke-current ${circleClass || ''}` } />
            </svg>
        </div>
    );
};

export default Spinner;
