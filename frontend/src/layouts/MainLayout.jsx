import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />

      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
