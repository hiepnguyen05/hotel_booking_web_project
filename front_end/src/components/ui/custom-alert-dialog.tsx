"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { cn } from "./utils";
import { buttonVariants } from "./button";

const CustomAlertDialog = AlertDialog.Root;

const CustomAlertDialogTrigger = AlertDialog.Trigger;

const CustomAlertDialogPortal = AlertDialog.Portal;

const CustomAlertDialogOverlay = React.forwardRef(({ className, ...props }: any, ref) => (
  <AlertDialog.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
CustomAlertDialogOverlay.displayName = AlertDialog.Overlay.displayName;

const CustomAlertDialogContent = React.forwardRef(({ className, ...props }: any, ref) => (
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content
      ref={ref}
      className={cn(
        "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-6 rounded-xl border p-6 shadow-2xl duration-300 sm:max-w-lg",
        className
      )}
      {...props}
    />
  </AlertDialog.Portal>
));
CustomAlertDialogContent.displayName = AlertDialog.Content.displayName;

const CustomAlertDialogHeader = ({ className, ...props }: any) => (
  <div
    className={cn("flex flex-col gap-3 text-center sm:text-left", className)}
    {...props}
  />
);
CustomAlertDialogHeader.displayName = "CustomAlertDialogHeader";

const CustomAlertDialogFooter = ({ className, ...props }: any) => (
  <div
    className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
CustomAlertDialogFooter.displayName = "CustomAlertDialogFooter";

const CustomAlertDialogTitle = React.forwardRef(({ className, ...props }: any, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("text-xl font-bold leading-none tracking-tight", className)}
    {...props}
  />
));
CustomAlertDialogTitle.displayName = AlertDialog.Title.displayName;

const CustomAlertDialogDescription = React.forwardRef(({ className, ...props }: any, ref) => (
  <AlertDialog.Description
    ref={ref}
    className={cn("text-muted-foreground text-base", className)}
    {...props}
  />
));
CustomAlertDialogDescription.displayName = AlertDialog.Description.displayName;

const CustomAlertDialogAction = React.forwardRef(({ className, variant = "default", ...props }: any, ref) => {
  // Map variants to button styles
  const getVariantClass = () => {
    switch (variant) {
      case "destructive":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "outline":
        return "border border-primary text-primary hover:bg-primary hover:text-white";
      default:
        return "bg-primary hover:bg-primary/90 text-white";
    }
  };

  return (
    <AlertDialog.Action
      ref={ref}
      className={cn(
        buttonVariants(),
        getVariantClass(),
        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
});
CustomAlertDialogAction.displayName = AlertDialog.Action.displayName;

const CustomAlertDialogCancel = React.forwardRef(({ className, ...props }: any, ref) => (
  <AlertDialog.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300",
      className
    )}
    {...props}
  />
));
CustomAlertDialogCancel.displayName = AlertDialog.Cancel.displayName;

export {
  CustomAlertDialog,
  CustomAlertDialogPortal,
  CustomAlertDialogOverlay,
  CustomAlertDialogTrigger,
  CustomAlertDialogContent,
  CustomAlertDialogHeader,
  CustomAlertDialogFooter,
  CustomAlertDialogTitle,
  CustomAlertDialogDescription,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
};