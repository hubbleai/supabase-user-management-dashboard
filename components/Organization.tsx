"use client"

import { requestCarbon } from "@/utils/carbon";
import { Fragment, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { ColumnDef, Row } from "@tanstack/react-table"
import { DataTable } from "./ui/DataTable";
import { Button } from "./ui/Button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/Pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import Loader from "./ui/Loader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { OrganizationMember } from "@/hooks/useOrganizationMember";

type RowProps = {
    // These props describe the organization user to be displayed in the row
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;

    // These props are used to make requests to Carbon BE
    secret: string;
    organizationMember: OrganizationMember;
    getOrganizationMembers: () => Promise<void>;  
}

const columns: ColumnDef<RowProps>[] = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isAdmin",
        header: "Admin",
        cell: ({ row }) => (row.original.isAdmin && <IoCheckmarkCircleOutline className="ml-4"/>),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            // Disable actions for the current user's row so they dont
            // delete or demote themselves.
            row.original.organizationMember.organization_admin && 
            row.original.organizationMember.id !== row.original.id && 
            <OrganizationMemberActions row={row} />
        ),
    }
]

type ListAPIKeysResponse = {
    data: OrganizationMember[];
    count: number;
}

const Organization = (
    props: {
        secret: string,
        organizationMember: OrganizationMember,
    },
) => {
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [organizationMembers, setOrganizationMembers] = useState<RowProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { toast } = useToast();

    const getOrganizationMembers = async () => {
        setIsLoadingMembers(true);
        const offset = (currentPage - 1) * limit;
        const response = await requestCarbon(props.secret, "GET", `/customer/list?limit=${limit}&offset=${offset}`);
        setIsLoadingMembers(false);

        if (response.status !== 200) {
            toast({ description: "An error occured. Please try again." });
        } else {
            const deserializedResponse: ListAPIKeysResponse = await response.json();
            const tabulatedOrganizationMember: RowProps[] = deserializedResponse.data.map((organizationMember) => {
                return {
                    id: organizationMember.id,
                    email: organizationMember.email + (organizationMember.is_onboarded ? "" : ` [Invited]`),
                    name: (organizationMember.first_name || "") + " " + (organizationMember.last_name || ""),
                    isAdmin: organizationMember.organization_admin,
                    secret: props.secret,
                    organizationMember: props.organizationMember,
                    getOrganizationMembers,
                };
            });

            setOrganizationMembers(tabulatedOrganizationMember);
            setLastPage(deserializedResponse.count / limit);
        }
    };

    useEffect(() => {
        getOrganizationMembers();
    }, [currentPage]);

    return (
        <div>
            <div className="flex items-center justify-between mt-10 mb-8">
                <div>
                    <h1 className="font-bold text-lg">Manage Users</h1>
                    <p className="">Invite users and manage user permissions.</p>
                </div>


            </div>
          
            <div className="flex justify-between items-center mb-4">
                <h2 className="scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
                    Users
                </h2>
                
                <InviteButton
                    secret={props.secret}
                    organizationMember={props.organizationMember}
                    getOrganizationMembers={getOrganizationMembers}
                />
            </div>

            <OrganizationMembersTable
                data={organizationMembers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                lastPage={lastPage}
            />
        </div>
    );
};

const InviteButton = (
    props: {
        secret: string,
        organizationMember: OrganizationMember,
        getOrganizationMembers: () => Promise<void>,
    },
) => {
    const [isInviting, setIsInviting] = useState(false);
    const [isLoadingInvite, setIsLoadingInvite] = useState(false);
    const [email, setEmail] = useState("");

    const { toast } = useToast();

    const inviteTeamMember = async () => {
        setIsLoadingInvite(true)
        const response = await requestCarbon(
            props.secret,
            "POST",
            "/customer/invite",
            { email },
        )
        setIsLoadingInvite(false)

        setIsInviting(false)
        setEmail("")
        if (response.status !== 200){
            toast({ description: "An error occured."})
        } else {
            await props.getOrganizationMembers()
            toast({ description: "An invitation has been sent."})
        }
    }

    return (
        <Dialog open={isInviting} onOpenChange={setIsInviting}>
            {
                props.organizationMember.organization_admin && (
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsInviting(true)}>Invite</Button>
                    </DialogTrigger>
                )
            }

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="pb-2">Invite a Team Member</DialogTitle>
                </DialogHeader>

                <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <DialogFooter>
                    <Button
                        type="button"
                        onClick={inviteTeamMember}
                        disabled={isLoadingInvite}
                    >
                        {isLoadingInvite && <Loader className="mr-2" />}
                        {isLoadingInvite ? 'Inviting...' : 'Invite'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const range = (size: number, startAt = 0, max?: number) => {
    let actualSize = size;
    if (max && startAt + size > max) {
        actualSize = max + 1 - startAt;
    } 
    return Array.from({length: actualSize}, (_, index) => index + startAt);
}

const OrganizationMembersTable = (
    props: {
        data: RowProps[], 
        currentPage: number,
        setCurrentPage: (pageNumber: number) => void,
        lastPage: number,
    },
) => {
    const pageRange = range(5, Math.min(1, props.currentPage), props.lastPage);

    return (
        <div className="flex flex-col">
            <DataTable columns={columns} data={props.data} />
            <Pagination className="mt-4">
                <PaginationContent>
                    {
                        props.currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious onClick={() => props.setCurrentPage(props.currentPage - 1)} />
                            </PaginationItem>
                        )
                    }
                    {
                        pageRange.map((value) => {
                            let className = ""
                            if (value === props.currentPage) {
                                className += "underline hover:bg-transparent"
                            }

                            return (
                                <PaginationItem key={value}>
                                    <PaginationLink 
                                        className={className}
                                        onClick={() => props.setCurrentPage(value)}
                                    >
                                        {value}
                                    </PaginationLink>
                                </PaginationItem>
                            );  
                        })
                    }
                    {
                        Boolean(pageRange.length) && pageRange[pageRange.length - 1] !== props.lastPage && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )
                    }
                    {
                        props.currentPage < props.lastPage && (
                            <PaginationItem>
                                <PaginationNext onClick={() => props.setCurrentPage(props.currentPage + 1)}/>
                            </PaginationItem>
                        )
                    }
                </PaginationContent>
            </Pagination>
        </div>
    );
}

const OrganizationMemberActions = (
    props: {
        row: Row<RowProps>,
    }
) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isLoadingDeletion, setIsLoadingDeletion] = useState(false);

    const { toast } = useToast()

    const updateOrganizationMember = async () => {
        setIsLoadingUpdate(true);
        const response = await requestCarbon(
            props.row.original.secret,
            "POST",
            "/customer/update",
            { 
                id: props.row.original.id,
                organization_admin: !props.row.original.isAdmin,
            },
        )
        setIsLoadingUpdate(false);

        if (response.status !== 200){
            toast({ description: "An error occured."})
        } else {
            await props.row.original.getOrganizationMembers()
            toast({ description: "Updated member's role"})
        }
    };

    const deleteOrganizationMember = async () => {
        setIsLoadingDeletion(true);
        const response = await requestCarbon(
            props.row.original.secret,
            "POST",
            "/customer/delete",
            { 
                ids: [props.row.original.id]
            },
        );
        setIsLoadingDeletion(false);

        setIsDeleting(false);
        if (response.status !== 200){
            toast({ description: "An error occured."});
        } else {
            await props.row.original.getOrganizationMembers();
            toast({ description: "Deleted organization member"});
        }
    };

    return (
        <Fragment>
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="pb-2">Delete Organization Member?</DialogTitle>
                        <DialogDescription className="pb-1">
                            Are you sure you want to delete this organization member?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setIsDeleting(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={deleteOrganizationMember}
                            disabled={isLoadingDeletion}
                        >
                            {isLoadingDeletion && <Loader className="mr-2" />}
                            {isLoadingDeletion ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={updateOrganizationMember}
                    >
                        { props.row.original.isAdmin ? "Remove" : "Make" } Admin
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setIsDeleting(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    );
}

export default Organization;