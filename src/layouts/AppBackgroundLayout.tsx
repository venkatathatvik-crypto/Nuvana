import React from "react";

const AppBackgroundLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

            {/* Doodle Background */}
            <div
                className="absolute inset-0 opacity-60 bg-cover bg-center pointer-events-none"
                style={{
                    backgroundImage: "url('/doodle-bg.png')",
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AppBackgroundLayout;
