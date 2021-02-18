import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";
import Datepicker, { Weekdays } from "../Components/Datepicker";

const Home = () => {
    let foo: string = "React";
    const bar: string = "TypeScript";

    return (
        <>
            <h1 className="bg-green-500">
                Hello {foo} + {bar} + Inertia
            </h1>
            <InertiaLink href="/test">test</InertiaLink>
            <div className="m-8" style={{ width: 256, height: 256 }}>
                <Datepicker
                    language="nl-NL"
                    prevLabel="Vorige maand"
                    nextLabel="Volgende maand" />
            </div>
        </>
    );
};

export default Home;
