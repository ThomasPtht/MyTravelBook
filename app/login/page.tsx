"use client"

import { Card } from "@/components/ui/card"
import LoginForm from "./components/LoginForm"

const LoginPage = () => {
    // const { data: session } = useSession();

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Welcome back on My Travel Book !
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Log in to continue your travel adventure
                    </p>
                </div>

                <Card className="p-8 shadow-lg">
                    <LoginForm />
                </Card>
            </div>
        </div>
    )
}

export default LoginPage
