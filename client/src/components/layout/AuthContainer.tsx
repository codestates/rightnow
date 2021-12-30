import React, { ReactElement } from "react";

interface IProps {
    children: ReactElement;
}

const AuthContainer = ({ children }: IProps) => {
    return <main className="min-h-login mt-2 text-center pt-12 pb-10">{children}</main>;
};

export default AuthContainer;
