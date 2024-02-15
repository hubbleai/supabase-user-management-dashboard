'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrgsStore } from '@/store/useOrgsStore';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/ui/Loader';

const supabase = createClient();

function CreateAPIKeys() {
    const [label, setLabel] = useState('My New Key');
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();
    const { toast } = useToast();
    const { activeOrg } = useOrgsStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const createAPIKey = async () => {
        if (!label || !user || !activeOrg) return;
        setIsLoading(true); // Start loading
        const newKey = uuidv4();
        const { error } = await supabase.from('api_keys').insert([
            {
                key: newKey,
                label,
                created_by: user.id,
                org_id: activeOrg.org_id,
            },
        ]);

        setIsLoading(false); // Stop loading
        if (error) {
            toast({
                description: 'API Key Creation Failed',
            });
        } else {
            toast({
                description: 'New API Key Created',
            });
            setKey(newKey);
            setIsDialogOpen(false); // Close the dialog on success
        }
    };

    return (
        <div className="my-5">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Create New API Key
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Key</DialogTitle>
                        <DialogDescription>
                            Anyone with this key will be able to access Carbon
                            APIs on behalf of your org. You can disable or
                            delete the key at any time.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Label
                            </Label>
                            <Input
                                id="name"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={createAPIKey}
                            disabled={isLoading}
                        >
                            {isLoading && <Loader className="mr-2" />}
                            {isLoading ? 'Creating...' : 'Create API Key'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {key && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">New API Key</h3>
                    <p className="text-sm text-zinc-500">
                        Save this key, it will not be shown again.
                    </p>
                    <div className="mt-2 rounded-lg bg-zinc-100 p-4">{key}</div>
                </div>
            )}
        </div>
    );
}

export default CreateAPIKeys;
