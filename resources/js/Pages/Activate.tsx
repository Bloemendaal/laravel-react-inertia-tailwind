import * as React from 'react';
import ActivateConnect from '../components/Activate/Connect';
import ActivateName from '../components/Activate/Name';
import { ActivateResponse } from '../models/Activate';

const Activate: React.FunctionComponent = () => {
    const [token, setToken] = React.useState<ActivateResponse>();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-kelly-green pb-32">
                <header className="py-10">
                    <div className="max-w-2xl mx-auto px-4 sm:px-8">
                        <h1 className="text-3xl font-bold text-white">
                            { token ? 'Koppelen aan een virtueel scherm' : 'Scherm verbinden' }
                        </h1>
                    </div>
                </header>
            </div>
            <main className="-mt-32">
                <div className="max-w-2xl mx-auto pb-12 px-4 sm:px-8">
                    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                        { token ?
                            <ActivateName /> :
                            <ActivateConnect onComplete={ setToken } /> }
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Activate;
