import "./Header.scss";
import { Navbar } from "@/components/navbar/Navbar";
//import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  

  return ( 
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        
        <Navbar />
        <div className="ml-auto flex items-center space-x-4">
       
          
        </div>
      </div>
    </div>
  );
};
 
export default Header;


