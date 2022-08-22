import { Flex, Text, useTheme } from "@aws-amplify/ui-react";

export function LoginFooter() {
    const { tokens } = useTheme();

    return (
        <Flex justifyContent="center" padding={tokens.space.small}>
            <Text color={"#FFF"}>Copyright © {new Date().getFullYear()} {" "}
                David Tal, Lucas Kujawski and Saar Pernik</Text>
        </Flex>
    );
}
