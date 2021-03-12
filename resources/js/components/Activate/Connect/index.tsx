import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import PinField from 'react-pin-field';
import { ActivateResponse, AllowedCodeChars, CodeLength } from '../../../models/Activate';
import csrf from '../../../services/csrf';
import Button from '../../UI/Button';

export interface ActivateConnectProps {
    onComplete?: (token: ActivateResponse) => void;
}

const ActivateConnect: React.FunctionComponent<ActivateConnectProps> = ({ onComplete }) => {

    let initialUserCode = '';
    const urlParams = new URLSearchParams(window.location.search);
    const codeString = urlParams.get('user_code')?.trim();

    if (codeString) {
        for (let index = 0; index < codeString.length; index++) {
            const char = codeString[index];

            if (AllowedCodeChars.test(char)) {
                initialUserCode += char;
            }
        }
    }

    const [error, setError] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [userCode, setUserCode] = React.useState(initialUserCode);

    const pinField = React.useRef<HTMLInputElement[]>(null);
    React.useEffect(() => {
        if (pinField.current) {
            pinField.current[0].focus();

            pinField.current.forEach((element, i) => {
                userCode[i] && (element.value = userCode[i]);
            });
        }
    }, []);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (userCode.length < CodeLength && userCode.split('').every(char => AllowedCodeChars.test(char))) {
            setError('Controleer of de code correct is ingevuld.');
            return;
        }

        setSubmitting(true);

        axios({
            url: '/oauth/device-tokens',
            method: 'POST',
            data: new URLSearchParams({
                'user_code': userCode.slice(0, 4) + '-' + userCode.slice(4, 8)
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrf
            }
        }).then((response: AxiosResponse<ActivateResponse>) => {
            setSubmitting(false);
            onComplete && onComplete(response.data);
        }).catch(() => {
            setSubmitting(false);
            setError('Er is iets misgegaan. Klopt de code?');
        });
    };

    return (
        <form onSubmit={ submit }>
            <div className="mb-6">
                Voer de code in die op het scherm weergegeven wordt en klik vervolgens op toevoegen.
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                <PinField
                    length={ 8 }
                    ref={ pinField }
                    validate={ AllowedCodeChars }
                    disabled={ submitting }
                    onChange={ setUserCode }
                    className="uppercase px-0.5 shadow-sm focus:ring-kelly-green focus:border-kelly-green block text-3xl border-gray-300 rounded-md text-center w-full sm:w-16 transition-transform transform scale-100 focus:scale-105" />
            </div>
            <div className="w-full sm:flex mt-4">
                <div className="my-auto w-full">
                    {
                        error && (
                            <div className="text-red-500 text-sm">
                                { error }
                            </div>
                        )
                    }
                </div>
                <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                    <Button
                        type="submit"
                        disabled={ userCode.length < CodeLength }
                        submitting={ submitting && 'Laden...' }
                        className="ml-auto"
                    >
                        Toevoegen
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ActivateConnect;
