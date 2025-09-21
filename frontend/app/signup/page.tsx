
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../components/ui/input-otp";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("details");
    const [otp, setOtp] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();
        // Add your signup logic here
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
        setStep("otp");
    };

    const handleOtpVerification = (e) => {
        e.preventDefault();
        // Add your OTP verification logic here
        console.log("OTP:", otp);
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <Card>
                        {step === "details" ? (
                            <>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
                                    <CardDescription>Enter your details to sign up.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSignup} className="space-y-6">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="mt-1"
                                            />
                                        </div>
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
                                        <div>
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">Sign Up</Button>
                                    </form>
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Already have an account?{" "}
                                            <Link href="/login" className="font-medium text-primary hover:underline">
                                                Login
                                            </Link>
                                        </p>
                                    </div>
                                </CardContent>
                            </>
                        ) : (
                            <>
                                <CardHeader className="text-center">
                                    <CardTitle className="text-3xl font-bold">Enter OTP</CardTitle>
                                    <CardDescription>An OTP has been sent to {email}.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleOtpVerification} className="space-y-6">
                                        <div className="flex justify-center">
                                            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                        <Button type="submit" className="w-full">Verify OTP</Button>
                                    </form>
                                </CardContent>
                            </>
                        )}
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
