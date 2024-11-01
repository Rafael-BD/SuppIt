import { Separator } from "@/src/components/ui/separator";
import { PageForm } from "@/src/components/pageForm";

export default function SettingsPagePage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Page</h3>
                <p className="text-sm text-muted-foreground">
                    Customize your public page.
                </p>
            </div>
            <Separator />
            <PageForm />
        </div>
    );
}