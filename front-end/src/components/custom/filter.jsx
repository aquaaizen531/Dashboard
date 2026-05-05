import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

export function Filter({ filters, setFilters }) {
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState(undefined);
  const [endDate, setEndDate] = React.useState(undefined);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-sm text-black" asChild>
        <Button variant="outline">Filter</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {/* role */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {["All", "Admin", "Operator"].map((role, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        role: role === "All" ? "" : role,
                      }))
                    }
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* date range */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Date and Time</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {/* start date */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Start Date</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <FieldGroup className="mx-auto max-w-xs flex-row">
                        <Field>
                          <Popover
                            open={startDateOpen}
                            onOpenChange={setStartDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-32 justify-between text-xs font-normal"
                              >
                                {startDate
                                  ? format(startDate, "PPP")
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={startDate}
                                captionLayout="dropdown"
                                defaultMonth={startDate}
                                onSelect={(date) => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    startDate: date,
                                  }));
                                  setStartDate(date);
                                  setStartDateOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                      </FieldGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {/* start time */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Start Time</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <Field className="w-32">
                        <Input
                          type="time"
                          value={filters.startTime}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                          id="time-picker-optional"
                          step="1"
                          disabled={!startDate}
                          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </Field>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {/* end data */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>End Date</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {/* date picker */}

                      <FieldGroup className="mx-auto max-w-xs flex-row">
                        <Field>
                          <Popover
                            open={endDateOpen}
                            onOpenChange={setEndDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-32 justify-between text-xs font-normal"
                              >
                                {endDate
                                  ? format(endDate, "PPP")
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={endDate}
                                captionLayout="dropdown"
                                defaultMonth={endDate}
                                onSelect={(date) => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    endDate: date,
                                  }));
                                  setEndDate(date);
                                  setEndDateOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                      </FieldGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                {/* end time */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>End Time</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <Field className="w-32">
                        <Input
                          type="time"
                          value={filters.endTime}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                          id="time-picker-optional"
                          step="1"
                          disabled={!endDate}
                          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </Field>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* clear filter */}
          <DropdownMenuItem
            onClick={() =>
              setFilters({
                role: "",
                startDate: null,
                startTime: "",
                endDate: null,
                endTime: "",
              })
            }
          >
            Clear Filter
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
