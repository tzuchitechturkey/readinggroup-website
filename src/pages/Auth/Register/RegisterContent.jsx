import RegisterForm from "@/components/ForPages/Auth/Register/RegisterForm";
import Footer from "@/components/Global/Footer/Footer";

function RegisterContent() {
  return (
    <div
      className="w-full flex flex-col pt-16 relative border-0 outline-none min-h-screen"
      style={{
        backgroundImage: "url(../../../../src/assets/authback.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-30 z-0 bg-black" />
      <div className=" relative z-10">
        <RegisterForm />
      </div>
      <div className="flex  items-end  h-full z-10 mt-20 flex-1">
        <Footer authPages={true} />
      </div>
    </div>
  );
}

export default RegisterContent;
