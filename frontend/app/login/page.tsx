
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import Header from "../../components/shared/layout/Header";
import Footer from "../../components/shared/layout/Footer";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log("Email:", email);
        console.log("Password:", password);
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold">Login</CardTitle>
                            <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>
                                <Button type="submit" className="w-full">Login</Button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link href="/signup" className="font-medium text-primary hover:underline">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
