import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";

const Home = () => {
    let foo: string = "React";
    const bar: string = "TypeScript";

    return (
        <>
            <h1 className="bg-green-500">
                Hello {foo} + {bar} + Inertia
            </h1>
            <InertiaLink href="/test">test</InertiaLink>
        </>
    );
};

export default Home;
