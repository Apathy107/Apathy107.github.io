import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">404</h1>
        <p className="mb-4 text-xl text-gray-600">页面不存在</p>
        <button
          onClick={() => navigate("/")}
          className="text-primary font-medium underline hover:no-underline"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default NotFound;
