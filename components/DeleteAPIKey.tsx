'use client'

import { useState } from "react";
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { APIKey } from "./CreateAPIKeys";
import { Button } from "./ui/button";
import Loader from "./ui/Loader";
import { Trash } from "lucide-react";
import { requestCarbon } from "@/utils/carbon";

function CreateAPIKeys(
    props: { 
        apiKey: APIKey,
        getAPIKeys: () => Promise<void>,
        encryptedId: string,
    }
) {
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { user } = useAuthStore();
    const { toast } = useToast();

    const deleteAPIKey = async () => {
        if (!user ) {
            return;
        }

        setIsLoading(true);
        const response = await requestCarbon(
            props.encryptedId,
            "POST",
            "/customer/api-key/delete",
            {
                "api_keys": [props.apiKey.token_hash],
            }
        )

        if (response.status !== 200) {
            toast({
                description: 'API Key Deletion Failed',
            });
        } else {
            toast({
                description: "API Key Deleted.",
            });
            setIsDialogOpen(false);
            await props.getAPIKeys()
        }
        setIsLoading(false);
    }

    return (
        <div className="my-5">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Trash size={18}/>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete API Key</DialogTitle>
                        <DialogDescription>
                            This API key will not be usable after deletion.
                            Are you sure you want to delete "{props.apiKey.description}"
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={() => deleteAPIKey()}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader className="mr-2" />}
                            {isLoading ? 'Deleting...' : 'Delete API Key'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateAPIKeys;