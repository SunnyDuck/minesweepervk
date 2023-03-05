import React from 'react';
import './TimerApp.css';
interface timerApp<T>{
    numerals: string[];
    seconds: number;
}
export default function FlagsQuality<T>(props: timerApp<T>) {
    return (
        <div className='timer'>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[Math.trunc(props.seconds/100)]}}></div>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[Math.trunc((props.seconds/10)%10)]}}></div>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[props.seconds%10]}}></div>
        </div>
    );
};
