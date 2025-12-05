import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToRegister: () => void;
}

export default function LoginModal(props: LoginModalProps) {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submit pressed");

    e.preventDefault(); // Prevents page refresh
    setError("");

    try {
      await login({ username, password });
    } catch (error: unknown) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleModalClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    props.onClose();
  };

  const switchToRegisterModal = () => {
    handleModalClose();
    props.switchToRegister();
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account.
            </DialogDescription>
          </DialogHeader>
          <Field data-invalid={username.length <= 0}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="John Doe"
              onChange={handleUsernameChange}
              aria-invalid={username.length <= 0}
            ></Input>
            {username.length <= 0 && <FieldError>Invalid username.</FieldError>}
          </Field>
          <Field data-invalid={password.length < 6}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={handlePasswordChange}
              aria-invalid={password.length < 6}
            ></Input>
            {password.length < 6 && (
              <FieldError>
                Password must be at least 6 characters long.
              </FieldError>
            )}
          </Field>
          {error && (
            <Alert variant={"destructive"}>
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isLoading || username.length === 0 || password.length < 6
              }
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button onClick={handleModalClose} variant="outline" type="button">
              Cancel
            </Button>
          </DialogFooter>
          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              onClick={switchToRegisterModal}
              type="button"
              className="p-0 h-auto"
            >
              Sign Up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
