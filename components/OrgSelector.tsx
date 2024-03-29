'use client';

import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { useOrgsStore } from '@/store/useOrgsStore';

function OrgSelector() {
    const [open, setOpen] = useState(false);

    const { activeOrg, orgs, loading, setActiveOrg } = useOrgsStore();

    if (loading || !orgs.length) {
        return (
            <Image
                src="/logo-carbon.png"
                width={150}
                height={39.45}
                alt="Carbon Logo"
            />
        );
    }
    return (
        <div className="flex items-center">
            <Image
                src="/logo-carbon.png"
                width={150}
                height={39.45}
                alt="Carbon Logo"
            />

            <div className="flex items-center animate-in">
                <div className="mx-4 h-6 w-[1px] rotate-[20deg] bg-zinc-400"></div>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {activeOrg?.org_name ?? 'No Org Found'}
                            <div className="flex items-center">
                                <p className="rounded-full bg-zinc-200 px-2 py-[3px] text-xs text-zinc-600">
                                    Pro
                                </p>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search Org..." />
                            <CommandEmpty>No org found.</CommandEmpty>
                            <CommandGroup>
                                {orgs.map((org) => (
                                    <CommandItem
                                        key={org.org_id}
                                        value={org.org_id}
                                        onSelect={(currentValue) => {
                                            // get org from orgs based on org_id
                                            const newOrg = orgs.find(
                                                (org) =>
                                                    org.org_id === currentValue
                                            );

                                            // set active org
                                            if (newOrg) setActiveOrg(newOrg);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                activeOrg?.org_id === org.org_id
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {org.org_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

export default OrgSelector;
