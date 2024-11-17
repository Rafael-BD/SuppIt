"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/components/ui/popover"

interface DatePickerProps {
    dateType?: 'year' | 'month' | 'day';
    onDateChange?: (date: Date) => void;
}

export function DatePicker({ dateType = 'day', onDateChange }: DatePickerProps) {
    const [date, setDate] = React.useState<Date>()

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        if (onDateChange) {
            if (selectedDate) {
                onDateChange(selectedDate)
            }
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, dateType === 'year' ? "yyyy" : dateType === 'month' ? "MMM yyyy" : "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
