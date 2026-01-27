import React from 'react'
import RegisterForm from './components/RegisterForm'
import { Card } from '@/components/ui/card'


const RegisterPage = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Join My Travel Book !
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create your account to start your travel adventure!
                    </p>
                </div>

                <Card className="p-8 shadow-lg">
                    <RegisterForm />
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage
