import * as React from 'react';
import { Screen } from '../../../models/Screen';
import Button from '../../UI/Button';

export interface ActivateNameProps {
    onComplete?: (screen: Screen) => void;
}

const ActivateName: React.FunctionComponent<ActivateNameProps> = ({ onComplete }) => {
    const [screens, setScreens] = React.useState<Screen[]>();
    const [submitting, setSubmitting] = React.useState(false);
    const [selectedScreen, setSelectedScreen] = React.useState<Screen>();

    const get = () => {
        setScreens([
            {
                id: 1,
                name: 'Development scherm',
                connectedDevices: []
            },
            {
                id: 2,
                name: 'Marketing scherm',
                connectedDevices: []
            },
            {
                id: 3,
                name: 'HR scherm',
                connectedDevices: []
            }
        ]);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedScreen) {
            return;
        }

        setSubmitting(true);

        // TODO: Replace with actual submitting
        setTimeout(() => {
            setSubmitting(false);
            onComplete && onComplete(selectedScreen);
        }, 1000);
    };

    React.useEffect(() => {
        get();
    }, []);

    if (screens === undefined) {
        return <div>Bezig met laden...</div>;
    }

    return (
        <>
            <div className="bg-white rounded-md -space-y-px">
                {
                    screens.map((screen, i) => {
                        const selected = screen === selectedScreen;

                        return (
                            <div key={ i } className={ `relative ${selected ? 'z-10' : ''}` }>
                                <label className="cursor-pointer">
                                    <div className={ `border p-4 flex ${selected ? 'bg-kelly-green bg-opacity-5 border-kelly-green border-opacity-20' : 'border-gray-200'} ${i === 0 ? 'rounded-tl-md rounded-tr-md' : ''} ${i === screens.length - 1 ? 'rounded-bl-md rounded-br-md' : ''}` }>
                                        <div className="flex items-center h-5">
                                            <input
                                                type="radio"
                                                id={ `settings-option-${i}` }
                                                checked={ selected }
                                                onChange={ () => setSelectedScreen(screen) }
                                                className="focus:ring-kelly-green h-4 w-4 text-kelly-green cursor-pointer border-gray-300" />
                                        </div>
                                        <div className="ml-3 flex flex-col">
                                            <span className="block text-sm font-medium">
                                                { screen.name }
                                            </span>
                                            <span className={ `block text-sm ${selected ? 'text-kelly-green' : 'text-gray-500'}` }>
                                                { screen.connectedDevices.length } verbonden { screen.connectedDevices.length === 1 ? 'apparaat' : 'apparaten' }.
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        );
                    })
                }
            </div>
            <div className="flex mt-4">
                <Button className="ml-auto" disabled={ !selectedScreen || submitting } onClick={ submit }>Bevestigen</Button>
            </div>
        </>
    );
};

export default ActivateName;
