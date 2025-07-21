import { loginController } from "../Views/Login/loginController";
import { registroController } from "../Views/Registro/registroController";

export const routes={
    Login:{
        path:'Login/index.html',
        controlador:loginController,
        private:false
    },
    Registro:{
        path:'Registro/index.html',
        controlador:registroController,
        private:false
    }
}