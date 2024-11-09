import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import apiClient from "../services/api-client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "@heroicons/react/24/solid";
import { EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email({ message: "Email is required and must be valid!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const { setAuth } = useAuth();

  const [apiError, setApiError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      setApiError("");
      setLoading(true);
      const response = await apiClient.post("/login", data);

      const user = response.data.data;
      localStorage.setItem("womnizAuth", JSON.stringify(user));
      localStorage.setItem("womnizAuthToken", user.token);

      setAuth(user);
      navigate("/dashboard");
      setLoading(false);
    } catch (err: any) {
      if (!err.response) {
        setApiError("No Server Response!");
      }
      setApiError(
        err.response?.data?.data?.error || "An unexpected error occurred"
      );
      setLoading(false);
    }
  };

  const [isPasswordEyeOpen, setIsPasswordEyeOpen] = useState(false);

  return (
    <div className="container mx-auto ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-20">
          <div className="h-[700px]">
            <img
              src="/assets/login/loginImage.svg"
              alt="loginImage"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="max-w-[500px] grow">
            <h1 className="text-2xl font-extrabold mb-2">Sign in</h1>
            <p className="text-[#969696]">
              Please login to continue to your account.
            </p>
            <div className="mt-10">
              <div className="flex flex-col gap-3 mb-10">
                <label>Email</label>
                <input
                  {...register("email")}
                  id="email"
                  className="input input-bordered"
                  type="email"
                />
                {errors.email && (
                  <p className="text-[red] mt-2">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 relative">
                <label>Password</label>
                {isPasswordEyeOpen ? (
                  <EyeIcon
                    width={20}
                    className="absolute cursor-pointer top-1/2 mt-1 right-3"
                    onClick={() => setIsPasswordEyeOpen((prev) => !prev)}
                  />
                ) : (
                  <EyeOff
                    width={20}
                    className="absolute cursor-pointer top-1/2 mt-1 right-3"
                    onClick={() => setIsPasswordEyeOpen((prev) => !prev)}
                  />
                )}
                <input
                  {...register("password")}
                  id="password"
                  className="input input-bordered grow"
                  type={isPasswordEyeOpen ? "text" : "password"}
                />
              </div>
              {errors.password && (
                <p className="text-[red] mt-2">{errors.password.message}</p>
              )}
              {apiError && (
                <p className="text-[red] text-lg my-4">{apiError}</p>
              )}
              {/* <div className="flex justify-end mt-8 mb-4">
                <p className="text-[#367AFF]">Forget Password?</p>
              </div> */}
            </div>
            <div className="mt-10 flex justify-center items-center ">
              <button
                type="submit"
                
                className={`max-w-[350px] bg-[#577656] text-xl py-3 rounded-lg grow text-white`}
              >
                {isLoading ? (
                  <span className="loading loading-ring loading-md"></span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
