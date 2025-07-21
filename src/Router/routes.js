import { consolasController } from "../Views/Consolas/consolasController";
import { loginController } from "../Views/Login/loginController";
import { registroController } from "../Views/Registro/registroController";
import { reservasController } from "../Views/Reservas/reservasController";

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
    },
    Reservas:{
        path:'Reservas/index.html',
        controlador:reservasController,
        private:true
    },
    Consolas:{
        path:'Consolas/index.html',
        controlador:consolasController,
        private:true
    }
}