import React, { Component, HTMLAttributes } from 'react';

import Tooltip from './Tooltip';
import Day, { DayProps } from './Day';

import 'material-icons/iconfont/material-icons.css';

export interface DatepickerRange {
    start: Date;
    end: Date;
}

export interface UpdateDatepicker {
    (date: Date, VisibleRange: DatepickerRange): void;
}

export enum Weekdays {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
}

export interface DatepickerOwnProps {
    date?: Date;
    style?: React.CSSProperties;
    className?: string;
    nextLabel?: string;
    prevLabel?: string;
    language?: string;
    startWeekday?: Weekdays;
    onDatePick?: UpdateDatepicker;
    onUpdate?: UpdateDatepicker;
    onPrevMonth?: UpdateDatepicker;
    onNextMonth?: UpdateDatepicker;
}

export type DatepickerProps = DayProps & DatepickerOwnProps & HTMLAttributes<HTMLDivElement>;

export interface DatepickerState {
    date: Date;
    nextLabel: string;
    prevLabel: string;
    language: string;
}

interface Weekday {
    long: string;
    short: string
    narrow: string;
    weekday: number;
}

class Datepicker extends Component<DatepickerProps, DatepickerState> {
    constructor(props: DatepickerProps) {
        super(props);
        const { date, nextLabel, prevLabel, language } = this.props;

        this.state = {
            date: date || new Date(),
            nextLabel: nextLabel || 'Next month',
            prevLabel: prevLabel || 'Previous month',
            language: language || window.navigator.language
        };

        this.state.date.setHours(0, 0, 0, 0);
    }

    get Weekdays(): Weekday[] {
        const today = new Date();
        const days: (Weekday & { order: number })[] = [];

        while (days.length < 7) {
            days.push({
                long: today.toLocaleString(this.state.language, { weekday: 'long' }),
                short: today.toLocaleString(this.state.language, { weekday: 'short' }),
                narrow: today.toLocaleString(this.state.language, {
                    weekday: 'narrow',
                }),
                order: (today.getDay() + (7 - (this.props.startWeekday || Weekdays.Sunday))) % 7,
                weekday: today.getDay(),
            });

            today.setDate(today.getDate() + 1);
        }

        days.sort((a, b) => (a.order < b.order ? -1 : 1));

        return days.map((d) => ({
            long: d.long,
            short: d.short,
            narrow: d.narrow,
            weekday: d.weekday,
        }));
    }

    get VisibleRange(): DatepickerRange {
        return Datepicker.VisibleRangeBy(this.state.date, this.props.startWeekday);
    }

    static VisibleRangeBy(date?: Date | string | number, weekday: Weekdays = Weekdays.Sunday): DatepickerRange {
        const startDate = date ? new Date(date) : new Date();
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(1);

        startDate.setDate(
            startDate.getDate() -
            ((startDate.getDay() + (7 - weekday)) % 7)
        );

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 42);

        return {
            start: startDate,
            end: endDate,
        };
    }

    private capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

    onPrevMonth = (): void => {
        const { date } = this.state;
        date.setMonth(date.getMonth() - 1);

        this.setState(
            {
                date: date,
            },
            () => {
                const { onPrevMonth, onUpdate } = this.props;
                onPrevMonth && onPrevMonth(date, this.VisibleRange);
                onUpdate && onUpdate(date, this.VisibleRange);
            }
        );
    };

    onNextMonth = (): void => {
        const { date } = this.state;
        date.setMonth(date.getMonth() + 1);

        this.setState(
            {
                date: date,
            },
            () => {
                const { onNextMonth, onUpdate } = this.props;
                onNextMonth && onNextMonth(date, this.VisibleRange);
                onUpdate && onUpdate(date, this.VisibleRange);
            }
        );
    };

    onDatePick = (date: Date): void => {
        date.setHours(0, 0, 0, 0);
        this.setState(
            { date },
            () => {
                const { onDatePick, onUpdate } = this.props;
                onDatePick && onDatePick(date, this.VisibleRange);
                onUpdate && onUpdate(date, this.VisibleRange);
            }
        );
    };

    componentDidUpdate(prevProps: DatepickerProps): void {
        if (prevProps.date !== this.props.date) {
            this.onDatePick(this.props.date || this.state.date);
        }
    }

    renderHeader(): JSX.Element {
        const months: { icon: string, tooltip: string, callback: (event: React.MouseEvent) => void }[] = [
            {
                icon: 'chevron_left',
                tooltip: this.state.prevLabel,
                callback: this.onPrevMonth,
            },
            {
                icon: 'chevron_right',
                tooltip: this.state.nextLabel,
                callback: this.onNextMonth,
            }
        ];

        return (
            <div className="flex items-center text-gray-500 font-normal h-10">
                <span className="flex-grow pl-1.5 m-auto relative">
                    {this.capitalize(
                        this.state.date.toLocaleString(this.state.language, {
                            month: 'long',
                            year: 'numeric',
                        })
                    )}
                </span>
                {months.map((m, i) => (
                    <Tooltip key={i}
                        className="cursor-pointer group h-6 hover:bg-gray-500 hover:bg-opacity-10 inline-block mr-1.5 outline-none rounded-full select-none text-center w-6"
                        content={this.capitalize(m.tooltip)}
                        onClick={m.callback} >
                        <span className="material-icons">
                            {m.icon}
                        </span>
                    </Tooltip>
                ))}
            </div>
        );
    }

    renderDays(): JSX.Element {
        const { date } = this.state;
        const { tooltip, disable, border, dot } = this.props;

        const startDate = this.VisibleRange.start;

        return (
            <div className="table-row-group">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                    return (
                        <div key={i} className="table-row h-9">
                            {[0, 1, 2, 3, 4, 5, 6].map((j) => {
                                const currentDate = new Date(startDate);
                                startDate.setDate(startDate.getDate() + 1);

                                return (
                                    <Day
                                        key={j}
                                        date={new Date(currentDate)}
                                        selected={date}
                                        onDatePick={() => this.onDatePick(currentDate)}
                                        tooltip={tooltip}
                                        disable={disable}
                                        border={border}
                                        dot={dot}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    render(): JSX.Element {
        const { className, style } = this.props;

        return (
            <div className={`p-4 pt-0 select-none relative ${className || ''}`} style={style}>
                {this.renderHeader()}
                <div className="table table-fixed w-full text-xs font-medium">
                    <div className="table-row text-center h-9">
                        {this.Weekdays.map((d) => (
                            <Tooltip key={d.weekday}
                                className="table-cell font-medium align-middle outline-none text-gray-500"
                                content={this.capitalize(d.long)} >
                                <span>{d.narrow}</span>
                            </Tooltip>
                        ))}
                    </div>
                    {this.renderDays()}
                </div>
            </div>
        );
    }
}

export default Datepicker;
