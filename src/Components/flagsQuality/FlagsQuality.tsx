import React from 'react';
import './FlagsQuality.css';
interface flagsProps<T>{
    numerals: string[];
    flagsQuantity: number;
}
export default function FlagsQuality<T>(props: flagsProps<T>) {
    return (
        <div className='flagsQuality'>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[Math.trunc(props.flagsQuantity/100)]}}></div>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[Math.trunc((props.flagsQuantity/10)%10)]}}></div>
            <div className={'numeralValue'} style={{backgroundImage: props.numerals[props.flagsQuantity%10]}}></div>
        </div>
    );
};
