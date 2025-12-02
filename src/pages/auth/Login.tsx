
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/lib/auth";
import { GraduationCap, School, Loader2 } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
    const [activeTab, setActiveTab] = useState<UserRole>("student");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            await login(data.email, activeTab);
            navigate(activeTab === "student" ? "/student" : "/teacher");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <img
                            src="/logo.png"
                            alt="Nuvana360"
                            className="h-16 w-auto object-contain dark:invert-0 invert"
                        />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your Nuvana360 account
                    </p>
                </div>

                <Tabs
                    defaultValue="student"
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as UserRole)}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="student" className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                        </TabsTrigger>
                        <TabsTrigger value="teacher" className="flex items-center gap-2">
                            <School className="h-4 w-4" />
                            Teacher
                        </TabsTrigger>
                    </TabsList>

                    <Card className="border-border/50 shadow-xl">
                        <CardHeader>
                            <CardTitle>
                                {activeTab === "student" ? "Student" : "Teacher"} Login
                            </CardTitle>
                            <CardDescription>
                                Enter your credentials to access your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={
                                            activeTab === "student"
                                                ? "student@nuvana.com"
                                                : "teacher@nuvana.com"
                                        }
                                        {...register("email")}
                                        className="bg-background/50"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        className="bg-background/50"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
};

export default Login;
