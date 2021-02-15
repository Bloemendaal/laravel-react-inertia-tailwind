import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";

const Home = () => {
    let foo: string = "React";
    const bar: string = "TypeScript";

    return (
        <>
            <h1 className="bg-red-500">
                Hello {foo} + {bar} + Inertia
            </h1>
            <InertiaLink href="/home">home</InertiaLink>
        </>
    );
};

export default Home;
