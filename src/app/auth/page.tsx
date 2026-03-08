"use client";

import { Button, Card, CardBody, Input } from "@heroui/react";
import { useState } from "react";

export default function Auth() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className="flex justify-center items-center py-12">
			<Card className="w-full max-w-md p-4">
				<CardBody className="gap-6">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-1">
							{isLogin ? "Welcome Back" : "Create Account"}
						</h1>
						<p className="text-sm text-default-500">
							Mock authentication page for Cheap Radar
						</p>
					</div>

					<div className="flex flex-col gap-4">
						{!isLogin && (
							<Input
								label="Name"
								placeholder="Enter your name"
								variant="bordered"
							/>
						)}
						<Input
							label="Email"
							placeholder="Enter your email"
							type="email"
							variant="bordered"
						/>
						<Input
							label="Password"
							placeholder="Enter your password"
							type="password"
							variant="bordered"
						/>

						<Button color="primary" className="w-full h-12 mt-2">
							{isLogin ? "Sign In" : "Sign Up"}
						</Button>
					</div>

					<div className="text-center mt-2">
						<p className="text-sm text-default-500">
							{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
							<button
								type="button"
								className="text-primary font-medium hover:underline cursor-pointer bg-transparent border-none"
								onClick={() => setIsLogin(!isLogin)}
							>
								{isLogin ? "Sign up" : "Log in"}
							</button>
						</p>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
