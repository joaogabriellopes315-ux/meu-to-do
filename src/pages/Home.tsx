"use client";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your App</h1>
        <p className="text-xl text-gray-600">
          You are successfully logged in.
        </p>
        <a
          href="/login"
          className="mt-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </a>
      </div>
    </div>
  );
};

export default Home;