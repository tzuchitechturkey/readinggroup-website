import LoginForm from "@/components/ForPages/Auth/Login/LoginForm";
import Footer from "@/components/Global/Footer/Footer";

function LoginContent() {
  return (
    <div
      className="w-full flex flex-col pt-20 relative border-0 outline-none min-h-screen"
      style={{
        backgroundImage: "url(../../../../src/assets/authback.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center w-full min-h-screen opacity-60 z-0 bg-black" />
      <div className="relative z-1 mt-10 md:mt-16 lg:mt-32">
        <LoginForm />
      </div>
      <div className="flex items-end h-full z-10 mt-20 flex-1">
        <Footer authPages={true} />
      </div>
    </div>
  );
}

export default LoginContent;
