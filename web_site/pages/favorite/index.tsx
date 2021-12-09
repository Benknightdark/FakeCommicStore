import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Index = () => {
    const session=useSession();
    if(session.status=="unauthenticated"){
        return (
            <div>
                {session.status}
            </div>
        ); 
    }else{
        return (
            <div>
                Enter
            </div>
        );
    }
   
}

export default Index;