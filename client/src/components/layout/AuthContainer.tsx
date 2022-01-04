import React, { ReactElement } from "react";

interface IProps {
    children: ReactElement;
}

const AuthContainer = ({ children }: IProps) => {
    return <main className=" min-h-screen text-center pt-32 pb-10">{children}</main>;
};

export default AuthContainer;