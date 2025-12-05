"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User as UserIcon, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => authService.getCurrentUser(),
    enabled: isOpen,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Your account information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
            </>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to load profile information"}
              </AlertDescription>
            </Alert>
          ) : user ? (
            <>
              {/* User ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  User ID
                </label>
                <div className="px-3 py-2 bg-muted rounded-md">
                  <p className="text-sm font-mono">{user.user_id}</p>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Username
                </label>
                <div className="px-3 py-2 bg-muted rounded-md">
                  <p className="text-sm font-semibold">{user.username}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Account Status
                </label>
                <div className="flex items-center gap-2">
                  {user.is_active ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                        Active
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800">
                        Inactive
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <div className="px-3 py-2 bg-muted rounded-md">
                  <p className="text-sm">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
