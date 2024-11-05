'use client';
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { useToast } from "@/src/hooks/use-toast";
import { fetchAccountData, registerStripe } from "@/src/api/backend";
import { Loader2 } from "lucide-react";

export default function SettingsPaymentsPage() {
    const { toast } = useToast();
    const [stripeLinked, setStripeLinked] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const checkStripeLink = async () => {
            try {
                const data = await fetchAccountData();
                if (data.stripe_id) {
                    setStripeLinked(true);
                }
            } catch (error) {
                console.error("Error fetching account data:", error);
            }
        };

        checkStripeLink();
    }, []);

    async function handleRegisterStripe() {
        setIsRegistering(true);
        try {
            const response = await registerStripe();
            const { url } = response.data.acc;
            window.location.href = url;
        } catch (error) {
            console.error("Error registering Stripe account:", error);
            toast({
                title: "Error",
                description: "Failed to register Stripe account. Please try again.",
                color: "error",
            });
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Payments</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your payment settings and link your account to Stripe.
                </p>
            </div>
            <Separator />
            {stripeLinked ? (
                <div className="text-green-500">
                    <p>Your account is already linked to Stripe.</p>
                </div>
            ) : (
                <Button type="button" variant="outline" onClick={handleRegisterStripe} disabled={isRegistering}>
                    {isRegistering ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Register with Stripe"
                    )}
                </Button>
            )}
        </div>
    );
}