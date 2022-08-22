import { Image, useTheme } from "@aws-amplify/ui-react";

export function LoginHeader() {
    const { tokens } = useTheme();

    return (
        <Image
            alt="logo"
            src={require("assets/img/logo_white.png").default}
            padding={tokens.space.medium}
        />
    );
}
