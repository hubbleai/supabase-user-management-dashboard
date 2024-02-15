'use client';
import { useOrgsStore } from '@/store/useOrgsStore';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
    {
        name: 'Jan',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Feb',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Mar',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Apr',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'May',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Jun',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Jul',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Aug',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Sep',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Oct',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Nov',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: 'Dec',
        total: Math.floor(Math.random() * 5000) + 1000,
    },
];

function UsageDashboard() {
    const { activeOrg } = useOrgsStore();

    if (!activeOrg) {
        return null;
    }

    return (
        <div className="mt-10 flex w-full flex-col">
            <h1 className="text-md mb-5 font-semibold">API Usage</h1>
            <div className="w-full max-w-xl">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => `$${value}`}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-zinc-800"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default UsageDashboard;
