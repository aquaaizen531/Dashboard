/* eslint-disable react-refresh/only-export-components */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { memo, useCallback, useState } from "react";

const ConfirmDialog = memo(
  ({
    open,
    setOpen,
    handleConfirm,
    handleCancel,
    title,
    description,
    variant,
  }) => {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" onClick={handleCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction variant={variant} onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ConfirmDialog.displayName = "ConfirmDialog";

export const useConfirm = ({
  title = "Are you sure?",
  description = "This action cannot be undone",
  variant = "default",
}) => {
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setResolver(() => resolve);
      setOpen(true);
    });
  };

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    setResolver(null);
    setOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    resolver?.(false);
    setResolver(null);
    setOpen(false);
  }, [resolver]);

  const DialogComponent = useCallback(
    () => (
      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        title={title}
        description={description}
        variant={variant}
      />
    ),
    [open, handleConfirm, handleCancel, title, description, variant],
  );
  return [DialogComponent, confirm];
};
