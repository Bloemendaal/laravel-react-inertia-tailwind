import React, { Component } from 'react';
import { Property as CSS } from 'csstype';

import Tooltip from './Tooltip';


export interface DayProps {
    border?: (date: Date) => boolean | CSS.BorderColor;
    dot?: (date: Date) => boolean | CSS.BackgroundColor;
    disable?: (date: Date) => boolean;
    tooltip?: (date: Date) => string | null;
}

interface DayOwnProps {
    date: Date;
    selected: Date;
    onDatePick: (event: React.MouseEvent) => void;
}

class Day extends Component<DayProps & DayOwnProps> {
    get Border(): React.CSSProperties {
        const { border, date } = this.props;

        const result = border && border(date);
        if (!result) {
            return {};
        }

        if (result === true) {
            return {
                borderStyle: 'solid',
                borderWidth: 1,
            };
        }

        return {
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: result as CSS.BorderColor,
        };
    }

    getMonthClasses = (date: Date, selected: Date): string => {
        const { disable } = this.props;
        const classes = [
            'table-cell',
            'font-500',
            'align-middle',
            'outline-none',
            'text-center'
        ];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Set the month of the date
        if (selected.getMonth() === date.getMonth()) {
            classes.push('dp-date--this-month');
        } else {
            classes.push('dp-date--other-month');
        }

        // Check if date is selected
        if (selected.getTime() === date.getTime()) {
            classes.push('dp-date--selected');
        }

        // Check if date is today
        if (today.getTime() === date.getTime()) {
            classes.push('dp-date--today');
        }

        if (disable && disable(date)) {
            classes.push('dp-date--disabled');
        }

        return classes.join(' ');
    }

    renderDay(): JSX.Element {
        const { date, selected, dot, onDatePick } = this.props;

        const dotResult = dot && dot(date);

        return (
            <span
                onClick={onDatePick}
                className={this.getMonthClasses(date, selected)}
            >
                <div className="w-8 h-8 leading-8 m-auto rounded-full hover:bg-gray-500 hover:bg-opacity-10" style={this.Border}>
                    {date.getDate()}
                    {dotResult && (
                        <div
                            className="dp-dot"
                            style={{
                                backgroundColor: dotResult === true ? undefined : dotResult,
                            }}
                        />
                    )}
                </div>
            </span>
        );
    }

    render(): JSX.Element {
        const { date, tooltip } = this.props;
        const tooltipText = tooltip && tooltip(date);

        const day = this.renderDay();

        return tooltipText ?
            <Tooltip content={tooltipText}>
                {day}
            </Tooltip> : day;
    }
}

export default Day;
