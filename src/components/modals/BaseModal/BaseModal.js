import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";

function BaseModal({
  title = "title",
  trigger = undefined,
  initiallyOpen = true,
  footerElements,
  children,
  actionButtonText = "Continue",
  showActionButton = true,
  onClose = () => {
    // do nothing by default
  },
}) {
  const [isOpen, setIsOpen] = React.useState(initiallyOpen);

  React.useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  function handleCloseEvent() {
    //console.log("modal closed");
    onClose();
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {!!trigger && <AlertDialogTrigger>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        handleMouseDownOnOverlay={handleCloseEvent}
        onEscapeKeyDown={handleCloseEvent}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {footerElements}
          {showActionButton && (
            <AlertDialogAction onClick={() => {
              setIsOpen(false);
              onClose();
            }}>
              {actionButtonText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BaseModal;
